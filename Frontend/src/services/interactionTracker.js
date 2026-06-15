/**
 * interactionTracker — Standalone interaction tracking service
 * Maps to: promo_code_interactions table
 * Interaction types: VIEW, COPY, CLICK
 *
 * This is the single entry point for all UI interaction tracking.
 * DO NOT embed tracking logic inside UI components — always delegate here.
 *
 * All functions are async, non-blocking, fire-and-forget.
 * Requires a userId to be passed explicitly (caller extracts from auth context).
 *
 * Usage:
 *   import interactionTracker from '../../services/interactionTracker'
 *   interactionTracker.trackView(userId, discountId)
 *   interactionTracker.trackCopy(userId, discountId, promoCode)
 *   interactionTracker.trackClick(userId, discountId, metadata)
 *
 * For list viewport tracking, use createViewObserver:
 *   const observer = interactionTracker.createViewObserver(userId, onView)
 *   observer.observe(element)
 */
import { recordInteraction } from "./discountsService";

const SESSION_KEY = "it_viewed"; // sessionStorage key for VIEW dedup

function getViewedSet() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function persistViewedSet(set) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]));
  } catch {
    // storage full or unavailable — degrade silently
  }
}

/**
 * Track a VIEW event (deduplicated per session).
 * Returns true if tracked, false if duplicate.
 */
async function trackView(userId, discountId) {
  if (!userId || !discountId) return false;
  const viewed = getViewedSet();
  if (viewed.has(discountId)) return false;
  viewed.add(discountId);
  persistViewedSet(viewed);

  recordInteraction({
    user_id: userId,
    discount_id: discountId,
    interaction_type: "VIEW",
    interacted_at: new Date().toISOString(),
  }).catch(() => {});
  return true;
}

/**
 * Track a COPY event (promo code copied to clipboard).
 */
async function trackCopy(userId, discountId, promoCode) {
  if (!userId || !discountId) return;
  recordInteraction({
    user_id: userId,
    discount_id: discountId,
    promo_code: promoCode || null,
    interaction_type: "COPY",
    interacted_at: new Date().toISOString(),
  }).catch(() => {});
}

/**
 * Track a CLICK event (external link click, form redirect, etc).
 * Accepts optional metadata for extra context.
 */
async function trackClick(userId, discountId, metadata = {}) {
  if (!userId || !discountId) return;
  recordInteraction({
    user_id: userId,
    discount_id: discountId,
    interaction_type: "CLICK",
    ...metadata,
    interacted_at: new Date().toISOString(),
  }).catch(() => {});
}

/**
 * Create an IntersectionObserver for viewport-based VIEW tracking.
 * Each observed element tracks once when it becomes 30% visible.
 *
 * Usage:
 *   useEffect(() => {
 *     const obs = interactionTracker.createViewObserver(userId, discountId =>
 *       console.log('viewed', discountId)
 *     );
 *     if (ref.current) obs.observe(ref.current);
 *     return () => obs.disconnect();
 *   }, [userId]);
 */
function createViewObserver(userId, onView) {
  if (typeof IntersectionObserver === "undefined") return null;

  const viewedEls = new WeakSet();
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !viewedEls.has(entry.target)) {
          viewedEls.add(entry.target);
          // Extract discountId from data attribute
          const discountId = entry.target.dataset?.discountId;
          if (discountId) {
            trackView(userId, discountId);
            if (onView) onView(discountId);
          }
        }
      });
    },
    { threshold: 0.3 }
  );
}

const interactionTracker = { trackView, trackCopy, trackClick, createViewObserver };
export default interactionTracker;
