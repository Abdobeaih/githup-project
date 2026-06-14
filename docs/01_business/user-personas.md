# User Personas

## Project Name

Mustakleen Platform

---

# 1. Introduction

This document defines the primary user personas interacting with the Mustakleen platform.

The personas represent the main categories of users and help guide:

* feature design
* business understanding
* QA testing scenarios
* usability analysis
* future scalability decisions

---

# 2. Persona Overview

| Persona | Role                   |
| ------- | ---------------------- |
| Ahmed   | End User               |
| Sara    | Company Representative |
| Omar    | Platform Administrator |

---

# 3. Persona: Ahmed (End User)

## Background

Ahmed is a university graduate looking for discounts and installment-based services.

He uses the platform to:

* browse available offers
* redeem discounts
* track loyalty points
* manage installments

---

## Goals

* Find trusted discounts easily
* Save money using offers
* Track service usage
* Manage installment payments

---

## Technical Behavior

| Attribute          | Value            |
| ------------------ | ---------------- |
| Device Usage       | Mobile + Desktop |
| Technical Skill    | متوسط            |
| Preferred Language | Arabic           |
| Usage Frequency    | Daily            |

---

## Pain Points

* Complicated navigation
* Invalid or expired offers
* Session expiration
* Missing payment tracking

---

## Key Features Used

* Login & Signup
* Discounts Browse
* User Dashboard
* Loyalty Tracking
* Installments

---

# 4. Persona: Sara (Company Representative)

## Background

Sara represents a company that publishes discounts and service offers through the platform.

She uses the system to:

* publish offers
* manage discounts
* analyze customer engagement
* monitor analytics

---

## Goals

* Increase customer engagement
* Improve offer visibility
* Track redemption analytics
* Manage campaigns efficiently

---

## Technical Behavior

| Attribute          | Value    |
| ------------------ | -------- |
| Device Usage       | Desktop  |
| Technical Skill    | High     |
| Preferred Language | English  |
| Usage Frequency    | Frequent |

---

## Pain Points

* Delayed approvals
* Incorrect analytics
* Offer visibility problems
* Difficult dashboard workflows

---

## Key Features Used

* Company Dashboard
* Discount Management
* Analytics Dashboard
* Offer Creation

---

# 5. Persona: Omar (Platform Administrator)

## Background

Omar is responsible for monitoring and moderating the platform.

He ensures:

* offers comply with platform policies
* users behave appropriately
* system content remains controlled

---

## Goals

* Maintain platform stability
* Moderate content effectively
* Approve or reject offers
* Monitor system activities

---

## Technical Behavior

| Attribute          | Value   |
| ------------------ | ------- |
| Device Usage       | Desktop |
| Technical Skill    | High    |
| Preferred Language | English |
| Usage Frequency    | Daily   |

---

## Pain Points

* Unauthorized access attempts
* Approval workflow issues
* Missing observability
* Data inconsistency

---

## Key Features Used

* Admin Dashboard
* User Management
* Discount Approval
* System Monitoring

---

# 6. Persona Relationship Mapping

```
flowchart LR
    User[End User] --> Platform[Mustakleen Platform]
    Company[Company Representative] --> Platform
    Admin[Administrator] --> Platform
```

---

# 7. QA Impact

The personas help define:

* user journeys
* business flows
* acceptance criteria
* role-based testing
* edge-case scenarios
* accessibility considerations

They also support:

* exploratory testing
* regression planning
* automation prioritization

---

# 8. Conclusion

The platform currently serves three major user categories:

* end users
* companies
* administrators

Each persona interacts with the platform differently and introduces unique:

* business requirements
* risks
* testing priorities
* usability expectations
