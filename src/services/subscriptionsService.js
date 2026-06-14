/**
 * Subscriptions Service — API-first with localStorage fallback
 * Maps to: subscription_plans, user_subscriptions, payments, features
 * Statuses: ACTIVE, CANCELLED, EXPIRED, PENDING
 */
import api from "../api/axios";
import * as db from "../data/db";

// ── PLANS ────────────────────────────────────────────────
export async function getPlans() {
  try {
    const res = await api.get("/subscription-plans");
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getActivePlans() };
  }
}

export async function getPlanById(id) {
  try {
    const res = await api.get(`/subscription-plans/${id}`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getPlanById(id) };
  }
}

export async function createPlan(data) {
  try {
    const res = await api.post("/admin/subscription-plans", data);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.createPlan(data) };
  }
}

export async function updatePlan(id, data) {
  try {
    const res = await api.put(`/admin/subscription-plans/${id}`, data);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.updatePlan(id, data) };
  }
}

export async function deletePlan(id) {
  try {
    const res = await api.delete(`/admin/subscription-plans/${id}`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.softDeletePlan(id) };
  }
}

// ── FEATURES ─────────────────────────────────────────────
export async function getPlanFeatures(planId) {
  try {
    const res = await api.get(`/subscription-plans/${planId}/features`);
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
    const res = await api.post(`/subscription-plans/${planId}/features`, { feature_ids: featureIds });
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.setPlanFeatures(planId, featureIds) };
  }
}

// ── USER SUBSCRIPTIONS ───────────────────────────────────
export async function getMySubscription(userId) {
  try {
    const res = await api.get(`/user-subscriptions/${userId}`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getUserSubscription(userId) || null };
  }
}

export async function getSubscriptionHistory(userId) {
  try {
    const res = await api.get(`/user-subscriptions/${userId}/history`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getUserSubscriptionHistory(userId) };
  }
}

export async function subscribe(data) {
  try {
    const res = await api.post("/user-subscriptions", data);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.createUserSubscription(data) };
  }
}

export async function cancelSubscription(id) {
  try {
    const res = await api.put(`/user-subscriptions/${id}/cancel`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.cancelUserSubscription(id) };
  }
}

// ── PAYMENTS ─────────────────────────────────────────────
export async function getPaymentHistory(userId) {
  try {
    const res = await api.get(`/payments/user/${userId}`);
    return { data: res.data?.data || res.data };
  } catch {
    return { data: db.getPaymentsByUser(userId) || [] };
  }
}

export async function getAllPayments() {
  try {
    const res = await api.get("/admin/payments");
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
