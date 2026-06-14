# Software Requirements Specification (SRS)

## Project Name

Mustakleen Platform

---

# 1. Introduction

## 1.1 Purpose

This document defines the software requirements for the Mustakleen platform.

The SRS provides a complete description of:

* functional behavior
* non-functional requirements
* system interactions
* constraints
* assumptions
* user roles
* business rules

This document supports:

* software development
* QA planning
* system maintenance
* onboarding
* future scalability

---

## 1.2 Scope

Mustakleen is a frontend-based platform designed to:

* connect users and companies
* provide discount discovery and redemption
* support installment-based enrollments
* provide analytics dashboards
* support multilingual interfaces
* enable administrative moderation

The platform currently operates as a Single Page Application (SPA) using client-side persistence.

---

## 1.3 Definitions

| Term                | Definition                              |
| ------------------- | --------------------------------------- |
| SPA                 | Single Page Application                 |
| Discount Redemption | Process of applying and using discounts |
| Installment         | Scheduled partial payment               |
| Loyalty Points      | Reward points gained after redemptions  |
| Admin Approval      | Moderation workflow for discounts       |

---

# 2. Overall Description

---

## 2.1 Product Perspective

The platform is currently:

* frontend-only
* React-based
* using localStorage persistence
* operating without backend APIs

Future architecture may include:

* backend services
* secure authentication
* cloud deployment
* payment integrations

---

## 2.2 User Classes

| User Class             | Description                   |
| ---------------------- | ----------------------------- |
| End User               | Browses and redeems discounts |
| Company Representative | Publishes and manages offers  |
| Administrator          | Moderates platform operations |

---

## 2.3 Operating Environment

| Area             | Technology                    |
| ---------------- | ----------------------------- |
| Frontend         | React + Vite                  |
| Styling          | Tailwind CSS                  |
| Animations       | Framer Motion                 |
| State Management | React Context API             |
| Persistence      | localStorage + sessionStorage |
| Runtime          | Modern Web Browsers           |

---

## 2.4 Constraints

| Constraint         | Description                   |
| ------------------ | ----------------------------- |
| No Backend         | Platform is frontend-only     |
| Client-side Auth   | Authentication stored locally |
| Persistence Limits | localStorage limitations      |
| No Real Payments   | Payment flows are simulated   |

---

## 2.5 Assumptions

* Users access the platform using modern browsers.
* localStorage is enabled.
* Browser JavaScript execution is available.
* The platform operates in a trusted local/demo environment.

---

# 3. Functional Requirements

---

## FR-001 — Authentication

### Description

The system shall support user authentication.

### Requirements

* User login
* User logout
* Session persistence
* Role-based authorization

### Inputs

* Email
* Password

### Outputs

* Authenticated session
* Role-based redirect

---

## FR-002 — User Registration

### Description

The system shall support new user registration.

### Requirements

* Create user records
* Validate user data
* Prevent duplicate accounts

---

## FR-003 — Discount Browsing

### Description

Users shall browse approved discounts.

### Requirements

* Search discounts
* Filter discounts
* Display discount details
* Hide unapproved discounts

---

## FR-004 — Discount Redemption

### Description

Users shall redeem discounts.

### Requirements

* Generate promo code
* Create invoice record
* Track redemption history
* Increase loyalty points

---

## FR-005 — Installment Management

### Description

Users shall manage installments.

### Requirements

* Display payment schedules
* Mark installments as paid
* Update balances

---

## FR-006 — Company Management

### Description

Companies shall manage discounts and analytics.

### Requirements

* Create discounts
* View analytics
* Track redemption usage

---

## FR-007 — Administrative Moderation

### Description

Administrators shall moderate platform content.

### Requirements

* Approve discounts
* Reject discounts
* Manage users

---

## FR-008 — Localization

### Description

The system shall support multilingual interfaces.

### Requirements

* Language switching
* RTL/LTR support
* Translation persistence

---

# 4. Non-Functional Requirements

---

## NFR-001 — Performance

* Page interactions should respond within 2 seconds.
* Discount search operations should remain responsive.

---

## NFR-002 — Usability

* The platform shall support intuitive navigation.
* UI consistency should be maintained.

---

## NFR-003 — Reliability

* Sessions should restore correctly after refresh.
* localStorage persistence should remain consistent.

---

## NFR-004 — Security

* Unauthorized routes shall be protected.
* Sensitive information should not appear publicly.

---

## NFR-005 — Maintainability

* Components should remain modular.
* Documentation should support onboarding and QA.

---

## NFR-006 — Scalability

* Future backend integration should remain possible.
* Architecture should support future modularization.

---

# 5. System Features

| Feature        | Description                     |
| -------------- | ------------------------------- |
| Authentication | Login/logout/session management |
| Discounts      | Browse and redeem offers        |
| Installments   | Payment tracking                |
| Analytics      | Company insights                |
| Localization   | Arabic/English support          |
| Admin Panel    | Moderation and approvals        |

---

# 6. External Interfaces

---

## 6.1 User Interface

* React SPA interface
* Responsive layouts
* Animated transitions

---

## 6.2 Storage Interfaces

| Storage        | Purpose               |
| -------------- | --------------------- |
| localStorage   | Persist business data |
| sessionStorage | Persist sessions      |

---

# 7. Business Rules

| Rule ID  | Rule                                          |
| -------- | --------------------------------------------- |
| RULE-001 | Only authenticated users can redeem discounts |
| RULE-002 | Only approved discounts appear publicly       |
| RULE-003 | Only admins can approve discounts             |
| RULE-004 | Loyalty points increase after redemption      |
| RULE-005 | Unauthorized routes are blocked               |

---

# 8. Risks

| Risk                       | Impact                  |
| -------------------------- | ----------------------- |
| Client-side authentication | Security exposure       |
| localStorage corruption    | Data inconsistency      |
| Missing observability      | Difficult debugging     |
| No backend APIs            | Scalability limitations |

---

# 9. Future Enhancements

* Backend APIs
* Secure authentication
* Cloud deployment
* CI/CD pipelines
* Monitoring systems
* Real payment gateways
* Mobile support

---

# 10. Current Project Status

Current Phase:
Pre-QA Documentation & Reverse Engineering Completed.

Next Planned Phase:
QA Planning & Test Design.

---

# 11. Conclusion

The Mustakleen platform provides a modular frontend architecture designed to support:

* service discovery
* discount redemption
* administrative moderation
* installment management
* localization
* future scalability

This SRS forms the foundation for:

* QA planning
* system maintenance
* future production migration
* software evolution
