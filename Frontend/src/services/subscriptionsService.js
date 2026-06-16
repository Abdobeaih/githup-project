/**
 * Subscriptions Service — API-first with localStorage fallback
 * Maps to: subscription_plans, user_subscriptions, payments, features
 * Statuses: ACTIVE, CANCELLED, EXPIRED, PENDING
 */
import api from "../api/axios";
import * as db from "../data/db";

/**
 * ⚠️ IMPORTANT: These API paths must match backend routes in server.js:
 *   /api/plans         → planRoutes.js
 *   /api/subscriptions  → subscriptionRoutes.js
 *   /api/payments       → paymentRoutes.js
 *   /api/features       → featureRoutes.js
 */

// ── PLANS ────────────────────────────────────────────────
export async function getPlans() {
  try {
    const res = await api.get("/plans");
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
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.createPlan(data) };
  }
}

export async function updatePlan(id, data) {
  try {
    const res = await api.put(`/plans/${id}`, data);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.updatePlan(id, data) };
  }
}

export async function deletePlan(id) {
  try {
    const res = await api.delete(`/plans/${id}`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.softDeletePlan(id) };
  }
}

/**
 * Get all active plans with their features pre-populated from the backend.
 * Single API call — eliminates the N+1 feature loading problem.
 * Falls back to the old sequential getPlans + getPlanFeatures pattern.
 */
export async function getPlansWithFeatures() {
  try {
    const res = await api.get("/plans/with-features");
    return { data: res.data?.data || res.data };
  } catch {
    // Fallback: load plans then features separately
    const plansRes = await getPlans();
    const plans = plansRes?.data || [];
    const enriched = await Promise.all(plans.map(async (plan) => {
      try {
        const pfRes = await getPlanFeatures(plan.id || plan._id);
        return { ...plan, features: pfRes?.data || [] };
      } catch {
        return { ...plan, features: [] };
      }
    }));
    return { data: enriched };
  }
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
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.setPlanFeatures(planId, featureIds) };
  }
}

// ── USER SUBSCRIPTIONS ───────────────────────────────────
export async function getMySubscription(userId) {
  try {
    const res = await api.get("/subscriptions/my");
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getUserSubscription(userId) || null };
  }
}

export async function getSubscriptionHistory(userId) {
  try {
    const res = await api.get("/subscriptions/history");
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
    // Normalize planId → plan_id for local db compatibility
    return { data: db.createUserSubscription({ ...data, plan_id: data.plan_id || data.planId }) };
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
    const res = await api.get("/payments/my");
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
