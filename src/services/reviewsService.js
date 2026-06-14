/**
 * Reviews Service — API-first with db.js fallback
 * target_type: COMPANY | DISCOUNT
 * Uses db.js social_reviews collection for generic target_type/target_id reviews
 */

import api from "../api/axios"
import { getTargetReviews, addSocialReview, deleteSocialReview } from "../data/db"

// ── Reviews (generic — COMPANY / DISCOUNT) ─────────────────

export async function getReviews(targetType, targetId) {
  try {
    const res = await api.get("/reviews", { params: { target_type: targetType, target_id: targetId } })
    return res.data
  } catch {
    return { data: getTargetReviews(targetType, targetId) }
  }
}

export async function createReview({ target_type, target_id, user_id, rating, comment }) {
  try {
    const res = await api.post("/reviews", { target_type, target_id, user_id, rating, comment })
    return res.data
  } catch {
    const review = addSocialReview({ target_type, target_id, user_id, rating, comment })
    return { data: review }
  }
}

export async function deleteReview(id) {
  try {
    const res = await api.delete(`/reviews/${id}`)
    return res.data
  } catch {
    return deleteSocialReview(id)
  }
}
