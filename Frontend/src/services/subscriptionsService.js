/**
 * Subscriptions Service — API-first with localStorage fallback
 * Performance: in-memory + sessionStorage cache, in-flight dedup, fast local reads
 */
import api from "../api/axios";
import * as db from "../data/db";

const PLANS_CACHE_TTL_MS = 5 * 60 * 1000;
const PLANS_STORAGE_KEY = "mustakleen_plans_cache";
const API_FAST_TIMEOUT_MS = 2500;
const PLANS_API_TIMEOUT_MS = 2500;

let plansWithFeaturesCache = null;
let plansWithFeaturesCacheTime = 0;
let plansInflightPromise = null;

function isCacheFresh(time = plansWithFeaturesCacheTime) {
  return plansWithFeaturesCache && Date.now() - time < PLANS_CACHE_TTL_MS;
}

function setPlansCache(data) {
  plansWithFeaturesCache = data;
  plansWithFeaturesCacheTime = Date.now();
  try {
    sessionStorage.setItem(
      PLANS_STORAGE_KEY,
      JSON.stringify({ data, time: plansWithFeaturesCacheTime })
    );
  } catch {
    /* quota / private mode */
  }
}

function hydratePlansCacheFromStorage() {
  if (plansWithFeaturesCache) return plansWithFeaturesCache;
  try {
    const raw = sessionStorage.getItem(PLANS_STORAGE_KEY);
    if (!raw) return null;
    const { data, time } = JSON.parse(raw);
    if (data?.length && isCacheFresh(time)) {
      plansWithFeaturesCache = data;
      plansWithFeaturesCacheTime = time;
      return data;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Sync read — used for instant render (stale-while-revalidate). */
export function peekPlansWithFeaturesCache() {
  return plansWithFeaturesCache || hydratePlansCacheFromStorage();
}

export function invalidatePlansCache() {
  plansWithFeaturesCache = null;
  plansWithFeaturesCacheTime = 0;
  try {
    sessionStorage.removeItem(PLANS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Warm cache in background (navbar hover, idle prefetch). */
export function prefetchPlansWithFeatures() {
  if (isCacheFresh()) return Promise.resolve({ data: plansWithFeaturesCache });
  return getPlansWithFeatures();
}

/** Synchronous local DB read — instant fallback when API is slow/offline. */
function buildPlansFromLocalDb() {
  const plans = db.getActivePlans();
  return plans.map((plan) => ({
    ...plan,
    features: db
      .getPlanFeatures(plan.id)
      .map((link) => link.feature?.name || link.feature)
      .filter(Boolean),
  }));
}

async function fetchPlansWithFeaturesFromNetwork() {
  try {
    const res = await api.get("/plans/with-features", { timeout: PLANS_API_TIMEOUT_MS });
    const data = res.data?.data || res.data;
    if (Array.isArray(data) && data.length > 0) {
      setPlansCache(data);
      return { data };
    }
  } catch {
    /* fall through to instant local data */
  }

  const local = buildPlansFromLocalDb();
  setPlansCache(local);
  return { data: local };
}

// ── PLANS ────────────────────────────────────────────────
export async function getPlans() {
  try {
    const res = await api.get("/plans", { timeout: PLANS_API_TIMEOUT_MS });
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getActivePlans() };
  }
}

export async function getPlanById(id) {
  try {
    const res = await api.get(`/plans/${id}`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getPlanById(id) };
  }
}

export async function createPlan(data) {
  try {
    const res = await api.post("/plans", data);
    invalidatePlansCache();
    return { data: res.data?.data || res.data };
  } catch {
    invalidatePlansCache();
    return { data: db.createPlan(data) };
  }
}

export async function updatePlan(id, data) {
  try {
    const res = await api.put(`/plans/${id}`, data);
    invalidatePlansCache();
    return { data: res.data?.data || res.data };
  } catch {
    invalidatePlansCache();
    return { data: db.updatePlan(id, data) };
  }
}

export async function deletePlan(id) {
  try {
    const res = await api.delete(`/plans/${id}`);
    invalidatePlansCache();
    return { data: res.data?.data || res.data };
  } catch {
    invalidatePlansCache();
    return { data: db.softDeletePlan(id) };
  }
}

/**
 * Single API call with layered cache + in-flight deduplication.
 */
export async function getPlansWithFeatures({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = peekPlansWithFeaturesCache();
    if (cached) return { data: cached };
    if (plansInflightPromise) return plansInflightPromise;
  }

  plansInflightPromise = fetchPlansWithFeaturesFromNetwork().finally(() => {
    plansInflightPromise = null;
  });

  return plansInflightPromise;
}

// ── FEATURES ─────────────────────────────────────────────
export async function getPlanFeatures(planId) {
  try {
    const res = await api.get(`/plans/${planId}/features`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getPlanFeatures(planId) };
  }
}

export async function getFeatures() {
  try {
    const res = await api.get("/features");
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getFeatures() };
  }
}

export async function setPlanFeatures(planId, featureIds) {
  try {
    const res = await api.put(`/plans/${planId}/features`, { feature_ids: featureIds });
    invalidatePlansCache();
    return { data: res.data?.data || res.data };
  } catch {
    invalidatePlansCache();
    return { data: db.setPlanFeatures(planId, featureIds) };
  }
}

// ── USER SUBSCRIPTIONS ───────────────────────────────────
/** Instant local read — no network wait (packages page). */
export function getLocalSubscription(userId) {
  if (!userId) return null;
  return db.getUserSubscription(userId) || null;
}

export async function getMySubscription(userId, { preferLocal = true } = {}) {
  const local = getLocalSubscription(userId);

  if (preferLocal && local) {
    api
      .get("/subscriptions/my", { timeout: API_FAST_TIMEOUT_MS })
      .catch(() => {});
    return { data: local };
  }

  try {
    const res = await api.get("/subscriptions/my", { timeout: API_FAST_TIMEOUT_MS });
    return { data: res.data?.data || res.data || local };
  } catch {
    return { data: local };
  }
}

export async function getSubscriptionHistory(userId) {
  try {
    const res = await api.get("/subscriptions/history", { timeout: API_FAST_TIMEOUT_MS });
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getUserSubscriptionHistory(userId) };
  }
}

export async function subscribe(data) {
  try {
    const res = await api.post("/subscriptions", data);
    return { data: res.data?.data || res.data };
  } catch {
    return {
      data: db.createUserSubscription({ ...data, plan_id: data.plan_id || data.planId }),
    };
  }
}

export async function cancelSubscription(id) {
  try {
    const res = await api.put(`/subscriptions/${id}/cancel`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.cancelUserSubscription(id) };
  }
}

// ── PAYMENTS ─────────────────────────────────────────────
export async function getPaymentHistory(userId) {
  try {
    const res = await api.get("/payments/my", { timeout: API_FAST_TIMEOUT_MS });
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getPaymentsByUser(userId) || [] };
  }
}

export async function getAllPayments() {
  try {
    const res = await api.get("/payments");
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getAllPayments() };
  }
}

export async function createPayment(data) {
  try {
    const res = await api.post("/payments", data);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.createPayment(data) };
  }
}

// Hydrate memory cache on module load
hydratePlansCacheFromStorage();
