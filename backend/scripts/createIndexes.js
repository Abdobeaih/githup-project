/**
 * Database Index Creation Script
 * Run once to create indexes that significantly improve query performance
 * Usage: node scripts/createIndexes.js
 */

require('dotenv').config()
const mongoose = require('mongoose')

const User = require('../models/User')
const Company = require('../models/Company')
const Payment = require('../models/Payment')
const Discount = require('../models/Discount')
const UserScan = require('../models/UserScan')
const Enrollment = require('../models/Enrollment')
const SubscriptionPlan = require('../models/SubscriptionPlan')
const UserSubscription = require('../models/UserSubscription')
const Installment = require('../models/Installment')
const Review = require('../models/Review')
const Card = require('../models/Card')
const Bank = require('../models/Bank')
const Feature = require('../models/Feature')
const Notification = require('../models/Notification')
const Otp = require('../models/Otp')

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // User Model Indexes
    await User.collection.createIndex({ email: 1 })
    await User.collection.createIndex({ phone: 1 })
    await User.collection.createIndex({ plan: 1 })
    await User.collection.createIndex({ isActive: 1 })
    await User.collection.createIndex({ createdAt: -1 })
    console.log('✓ User indexes created')

    // Company Model Indexes
    await Company.collection.createIndex({ email: 1 })
    await Company.collection.createIndex({ status: 1 })
    await Company.collection.createIndex({ createdAt: -1 })
    console.log('✓ Company indexes created')

    // Payment Model Indexes
    await Payment.collection.createIndex({ user_id: 1 })
    await Payment.collection.createIndex({ status: 1 })
    await Payment.collection.createIndex({ createdAt: -1 })
    await Payment.collection.createIndex({ status: 1, createdAt: -1 })
    await Payment.collection.createIndex({ paid_at: 1 })
    console.log('✓ Payment indexes created')

    // Discount Model Indexes
    await Discount.collection.createIndex({ company_id: 1 })
    await Discount.collection.createIndex({ status: 1 })
    await Discount.collection.createIndex({ createdAt: -1 })
    await Discount.collection.createIndex({ name: 'text', description: 'text' })
    console.log('✓ Discount indexes created')

    // UserScan Model Indexes
    await UserScan.collection.createIndex({ discount_id: 1 })
    await UserScan.collection.createIndex({ user_id: 1 })
    await UserScan.collection.createIndex({ scanned_at: -1 })
    await UserScan.collection.createIndex({ discount_id: 1, scanned_at: -1 })
    console.log('✓ UserScan indexes created')

    // Enrollment Model Indexes
    await Enrollment.collection.createIndex({ user_id: 1 })
    await Enrollment.collection.createIndex({ company_id: 1 })
    await Enrollment.collection.createIndex({ status: 1 })
    await Enrollment.collection.createIndex({ createdAt: -1 })
    console.log('✓ Enrollment indexes created')

    // SubscriptionPlan Model Indexes
    await SubscriptionPlan.collection.createIndex({ isActive: 1 })
    await SubscriptionPlan.collection.createIndex({ priority: 1 })
    console.log('✓ SubscriptionPlan indexes created')

    // UserSubscription Model Indexes
    await UserSubscription.collection.createIndex({ userId: 1 })
    await UserSubscription.collection.createIndex({ status: 1 })
    await UserSubscription.collection.createIndex({ planId: 1 })
    await UserSubscription.collection.createIndex({ createdAt: -1 })
    console.log('✓ UserSubscription indexes created')

    // Installment Model Indexes
    await Installment.collection.createIndex({ user_id: 1 })
    await Installment.collection.createIndex({ createdAt: -1 })
    console.log('✓ Installment indexes created')

    // Review Model Indexes
    await Review.collection.createIndex({ company_id: 1 })
    await Review.collection.createIndex({ user_id: 1 })
    await Review.collection.createIndex({ createdAt: -1 })
    console.log('✓ Review indexes created')

    // Card Model Indexes
    await Card.collection.createIndex({ user_id: 1 })
    await Card.collection.createIndex({ cardNumber: 1 })
    console.log('✓ Card indexes created')

    // Notification Model Indexes
    await Notification.collection.createIndex({ user_id: 1 })
    await Notification.collection.createIndex({ isRead: 1 })
    await Notification.collection.createIndex({ createdAt: -1 })
    console.log('✓ Notification indexes created')

    // OTP Model Indexes (with TTL)
    await Otp.collection.createIndex({ email: 1 })
    await Otp.collection.createIndex({ role: 1 })
    await Otp.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 600 })
    console.log('✓ OTP indexes created')

    console.log('\n✅ All database indexes created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error creating indexes:', error.message)
    process.exit(1)
  }
}

createIndexes()
