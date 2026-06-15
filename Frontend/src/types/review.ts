export interface Review {
  id: number
  discount_id: number
  user_id: string
  rating: number
  comment: string
  created_at: string
  user?: import('./user').User
  discount?: import('./discount').Discount
}

export interface SocialReview {
  id: string
  target_type: string
  target_id: string | number
  user_id: string
  rating: number
  comment: string
  created_at: string
  user_name?: string
}

export interface ReviewCreatePayload {
  discount_id: number
  user_id: string
  rating: number
  comment: string
}

export interface SocialReviewCreatePayload {
  target_type: string
  target_id: string | number
  user_id: string
  rating: number
  comment: string
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  distribution: Record<number, number>
}
