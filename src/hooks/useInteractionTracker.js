/**
 * useInteractionTracker — Silent UI tracking hook
 * Maps to: promo_code_interactions table
 * Interaction types: VIEW, COPY, CLICK
 *
 * Automatically includes user_id from AuthContext.
 * All functions are async, non-blocking, fire-and-forget.
 *
 * Usage:
 *   const { trackView, trackCopy, trackClick } = useInteractionTracker()
 *   trackView(discountId)
 *   trackCopy(discountId, promoCode)
 *   trackClick(discountId, { some: 'metadata' })
 *
 * For list views (cards visible on screen), use viewRef:
 *   <div ref={viewRef(discountId)} />
 */
import { useCallback, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { recordInteraction } from "../services/discountsService";

export default function useInteractionTracker() {
  const { user, company } = useAuth();
  const userId = user?.id || company?.id || null;

  // Guard: track VIEW only once per discountId per mount
  const viewedRef = useRef(new Set());
  const observerRef = useRef(null);

  const track = useCallback(
    async (discountId, interactionType, promoCode = null, metadata = {}) => {
      if (!discountId || !userId) return;
      return recordInteraction({
        user_id: userId,
        discount_id: discountId,
        interaction_type: interactionType,
        promo_code: promoCode,
        ...metadata,
        interacted_at: new Date().toISOString(),
      }).catch(() => {}); // silent fail — never affects UX
    },
    [userId]
  );

  const trackView = useCallback(
    (discountId) => {
      if (!discountId || viewedRef.current.has(discountId)) return;
      viewedRef.current.add(discountId);
      track(discountId, "VIEW");
    },
    [track]
  );

  const trackCopy = useCallback(
    (discountId, promoCode) => {
      track(discountId, "COPY", promoCode);
    },
    [track]
  );

  const trackClick = useCallback(
    (discountId, metadata = {}) => {
      track(discountId, "CLICK", null, metadata);
    },
    [track]
  );

  // IntersectionObserver-based view tracking for card lists
  const viewRef = useCallback(
    (discountId) => (node) => {
      if (!node) return;
      if (typeof IntersectionObserver === "undefined") {
        trackView(discountId);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              trackView(discountId);
              observer.unobserve(node);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(node);
    },
    [trackView]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { trackView, trackCopy, trackClick, viewRef, viewedRef };
}
