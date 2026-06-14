# Data Dictionary

## Project Name

Mustakleen Platform

---

# 1. Introduction

This document defines the data dictionary for the Mustakleen platform.

The data dictionary provides:

* entity attributes
* field descriptions
* data types
* validation expectations
* business meaning

This document supports:

* QA validation
* backend migration
* API design
* persistence tracing
* database normalization planning

---

# 2. USERS Entity

| Field         | Type     | Description             | Validation            |
| ------------- | -------- | ----------------------- | --------------------- |
| id            | UUID     | Unique user identifier  | Required              |
| name          | String   | User full name          | Required              |
| email         | String   | User email address      | Unique + Valid Email  |
| password      | String   | User password           | Min Length Validation |
| role          | Enum     | User role               | Required              |
| governorate   | String   | User governorate        | Supported Value       |
| loyaltyPoints | Number   | Total loyalty points    | Non-negative          |
| createdAt     | DateTime | User creation timestamp | Auto-generated        |

---

# 3. COMPANIES Entity

| Field       | Type     | Description                | Validation     |
| ----------- | -------- | -------------------------- | -------------- |
| id          | UUID     | Company identifier         | Required       |
| companyName | String   | Company name               | Required       |
| email       | String   | Company email              | Valid Email    |
| category    | String   | Company category           | Required       |
| createdAt   | DateTime | Company creation timestamp | Auto-generated |

---

# 4. DISCOUNTS Entity

| Field         | Type     | Description               | Validation            |
| ------------- | -------- | ------------------------- | --------------------- |
| id            | UUID     | Discount identifier       | Required              |
| title         | String   | Discount title            | Required              |
| description   | String   | Discount description      | Required              |
| category      | String   | Discount category         | Required              |
| discountValue | Number   | Discount percentage/value | Positive Number       |
| startDate     | Date     | Offer start date          | Required              |
| endDate       | Date     | Offer expiration date     | Must exceed startDate |
| status        | Enum     | Discount status           | Required              |
| companyId     | UUID     | Owning company            | Required              |
| approvedAt    | DateTime | Approval timestamp        | Nullable              |

---

# 5. REDEMPTIONS Entity

| Field      | Type     | Description           | Validation     |
| ---------- | -------- | --------------------- | -------------- |
| id         | UUID     | Redemption identifier | Required       |
| userId     | UUID     | Redeeming user        | Required       |
| discountId | UUID     | Redeemed discount     | Required       |
| promoCode  | String   | Generated promo code  | Auto-generated |
| redeemedAt | DateTime | Redemption timestamp  | Auto-generated |
| invoiceId  | UUID     | Invoice identifier    | Required       |

---

# 6. INSTALLMENTS Entity

| Field             | Type   | Description            | Validation      |
| ----------------- | ------ | ---------------------- | --------------- |
| id                | UUID   | Installment identifier | Required        |
| userId            | UUID   | Related user           | Required        |
| totalAmount       | Number | Original amount        | Positive Number |
| remainingAmount   | Number | Remaining balance      | Non-negative    |
| installmentStatus | Enum   | Installment state      | Required        |
| dueDate           | Date   | Installment due date   | Required        |

---

# 7. LOYALTY_POINTS Entity

| Field       | Type     | Description               | Validation     |
| ----------- | -------- | ------------------------- | -------------- |
| id          | UUID     | Loyalty record identifier | Required       |
| userId      | UUID     | Related user              | Required       |
| totalPoints | Number   | Accumulated points        | Non-negative   |
| updatedAt   | DateTime | Last update timestamp     | Auto-generated |

---

# 8. ADMIN_ACTIONS Entity

| Field      | Type     | Description       | Validation     |
| ---------- | -------- | ----------------- | -------------- |
| id         | UUID     | Action identifier | Required       |
| adminId    | UUID     | Admin performer   | Required       |
| discountId | UUID     | Target discount   | Required       |
| actionType | Enum     | Moderation action | Required       |
| actionDate | DateTime | Action timestamp  | Auto-generated |

---

# 9. SESSIONS Entity

| Field        | Type     | Description                | Validation     |
| ------------ | -------- | -------------------------- | -------------- |
| id           | UUID     | Session identifier         | Required       |
| userId       | UUID     | Related user               | Required       |
| sessionToken | String   | Session token              | Required       |
| createdAt    | DateTime | Session creation timestamp | Auto-generated |
| expiresAt    | DateTime | Session expiration         | Required       |

---

# 10. Enum Definitions

---

## User Roles

| Value   |
| ------- |
| user    |
| company |
| admin   |

---

## Discount Status

| Value    |
| -------- |
| draft    |
| pending  |
| approved |
| rejected |
| expired  |

---

## Installment Status

| Value      |
| ---------- |
| unpaid     |
| processing |
| paid       |
| archived   |

---

## Admin Action Types

| Value   |
| ------- |
| approve |
| reject  |
| hide    |
| restore |

---

# 11. Validation Rules Summary

| Validation Area     | Description                |
| ------------------- | -------------------------- |
| Email Validation    | Valid email format         |
| Password Validation | Minimum length             |
| Positive Values     | Amounts cannot be negative |
| Date Validation     | startDate < endDate        |
| Enum Validation     | Allowed enum values only   |

---

# 12. Data Integrity Risks

| Risk                           | Impact             |
| ------------------------------ | ------------------ |
| Missing relational constraints | Invalid references |
| localStorage manipulation      | Data inconsistency |
| Invalid enums                  | Broken workflows   |
| Corrupted persistence          | Invalid UI state   |

---

# 13. QA Impact

The data dictionary supports:

* field validation testing
* boundary testing
* persistence validation
* API planning
* data integrity testing

---

# 14. Future Improvements

Future backend improvements may include:

* relational constraints
* indexed queries
* transactional operations
* ORM validation
* schema migrations

---

# 15. Conclusion

The data dictionary defines the structure and meaning of business data across the Mustakleen platform.

It provides a foundation for:

* QA validation
* backend migration
* persistence analysis
* future API architecture
