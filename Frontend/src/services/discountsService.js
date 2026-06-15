/**
 * Discounts Service — API-first with localStorage fallback
 * Maps to: discounts entity + promo_code_interactions
 * Types: PROMO_CODE (read-only), EXTERNAL_LINK (clickable), INSURANCE_FORM (form card), BANK_FORM (bank card)
 * Statuses: ACTIVE, EXPIRED, DISABLED
 */
import api from "../api/axios";
import * as db from "../data/db";

export async function getDiscounts(filters = {}) {
  try {
    const res = await api.get("/discounts", { params: filters });
    return res.data;
  } catch {
    let list = db.getAllDiscounts();
    if (filters.type) list = list.filter(d => d.discount_type === filters.type);
    if (filters.company_id) list = list.filter(d => d.company_id === filters.company_id);
    if (filters.status) list = list.filter(d => d.status === filters.status);
    if (filters.category) list = list.filter(d => d.category === filters.category);
    return { data: list };
  }
}

export async function getDiscountById(id) {
  try {
    const res = await api.get(`/discounts/${id}`);
    return res.data;
  } catch {
    const found = db.findDiscountById(id);
    if (!found) throw new Error("Discount not found");
    return { data: found };
  }
}

export async function createDiscount(data) {
  try {
    const res = await api.post("/discounts", data);
    return res.data;
  } catch {
    return { data: db.createDiscount(data) };
  }
}

export async function updateDiscount(id, updates) {
  try {
    const res = await api.put(`/discounts/${id}`, updates);
    return res.data;
  } catch {
    return { data: db.updateDiscount(id, updates) };
  }
}

export async function deleteDiscount(id) {
  try {
    const res = await api.delete(`/discounts/${id}`);
    return res.data;
  } catch {
    return { success: db.deleteDiscount(id) };
  }
}

// ── Discount Branches (many-to-many) ─────────────────────
export async function getDiscountBranches(discountId) {
  try {
    const res = await api.get(`/discounts/${discountId}/branches`);
    return res.data;
  } catch {
    return { data: db.getDiscountBranches(discountId) };
  }
}

export async function setDiscountBranches(discountId, branchIds) {
  try {
    const res = await api.put(`/discounts/${discountId}/branches`, { branchIds });
    return res.data;
  } catch {
    db.setDiscountBranches(discountId, branchIds);
    return { success: true };
  }
}

// ── Reviews ───────────────────────────────────────────────
export async function getDiscountReviews(discountId) {
  try {
    const res = await api.get(`/discounts/${discountId}/reviews`);
    return res.data;
  } catch {
    return { data: db.getDiscountReviews(discountId) };
  }
}

export async function addReview({ discount_id, user_id, rating, comment }) {
  try {
    const res = await api.post("/reviews", { discount_id, user_id, rating, comment });
    return res.data;
  } catch {
    return { data: db.addReview({ discount_id, user_id, rating, comment }) };
  }
}

// ── Interaction tracking — triggered from UI events ──────
// Maps to: promo_code_interactions table
// Fields: user_id, discount_id, branch_id (optional), promo_code, interaction_type (VIEW|COPY|CLICK), interacted_at
export async function recordInteraction({ user_id, discount_id, branch_id = null, promo_code = null, interaction_type, interacted_at }) {
  const payload = { user_id, discount_id, branch_id, promo_code, interaction_type, interacted_at };
  try {
    const res = await api.post("/interactions", payload);
    return res.data;
  } catch {
    const interactions = JSON.parse(localStorage.getItem("interactions") || "[]");
    interactions.push({ id: `INT-${Date.now()}`, ...payload });
    localStorage.setItem("interactions", JSON.stringify(interactions));
    return { success: true };
  }
}
