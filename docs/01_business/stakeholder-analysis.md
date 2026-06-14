# Stakeholder Analysis

## Project Name

Mustakleen Platform

---

# 1. Introduction

This document identifies the primary stakeholders involved in the Mustakleen platform and defines their roles, responsibilities, interests, and influence on the system.

---

# 2. Stakeholder Overview

| Stakeholder        | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| End Users          | Individuals using the platform to browse and redeem discounts |
| Companies          | Businesses publishing and managing offers                     |
| Administrators     | Platform managers responsible for approvals and moderation    |
| Developers         | Technical team maintaining and enhancing the platform         |
| QA Team            | Responsible for validating functionality and quality          |
| Future DevOps Team | Responsible for deployment and monitoring                     |
| Product Owners     | Responsible for business goals and feature direction          |

---

# 3. Stakeholder Responsibilities

## 3.1 End Users

### Responsibilities

* Create accounts
* Browse available offers
* Redeem discounts
* Manage profiles and installments

### Interests

* Easy navigation
* Fast discount redemption
* Reliable platform experience

### Risks

* Session corruption
* Data inconsistency
* Invalid discount visibility

---

## 3.2 Companies

### Responsibilities

* Publish discounts
* Manage company information
* Track analytics and usage

### Interests

* Increased customer engagement
* Analytics visibility
* Stable discount workflows

### Risks

* Incorrect analytics
* Approval delays
* Offer visibility issues

---

## 3.3 Administrators

### Responsibilities

* Approve or reject discounts
* Moderate users and content
* Monitor platform activities

### Interests

* Controlled platform operations
* Security and moderation
* Data consistency

### Risks

* Unauthorized access
* Approval workflow failures
* Data corruption

---

## 3.4 Developers

### Responsibilities

* Maintain frontend architecture
* Manage state and persistence
* Improve scalability and maintainability

### Interests

* Clean architecture
* Low technical debt
* Reusable components

### Risks

* Monolithic db.js complexity
* Lack of backend infrastructure
* Scalability limitations

---

## 3.5 QA Team

### Responsibilities

* Validate business flows
* Perform functional and regression testing
* Validate edge cases and negative scenarios

### Interests

* Stable test environments
* Deterministic data
* Testability support

### Risks

* Lack of logging
* Missing automation hooks
* Inconsistent UI states

---

# 4. Stakeholder Influence Matrix

| Stakeholder    | Influence | Interest |
| -------------- | --------- | -------- |
| Administrators | High      | High     |
| Product Owners | High      | High     |
| Developers     | High      | High     |
| QA Team        | Medium    | High     |
| Companies      | Medium    | High     |
| End Users      | Medium    | High     |
| DevOps Team    | Medium    | Medium   |

---

# 5. Communication Needs

| Stakeholder    | Needed Information             |
| -------------- | ------------------------------ |
| End Users      | Offer visibility and usability |
| Companies      | Analytics and approvals        |
| Administrators | Moderation reports             |
| Developers     | Technical architecture         |
| QA Team        | Requirements and risks         |
| Product Owners | Progress and KPIs              |

---

# 6. Stakeholder Risks Summary

| Risk Area                  | Affected Stakeholders      |
| -------------------------- | -------------------------- |
| Client-side authentication | Users, Admins              |
| Data persistence issues    | All stakeholders           |
| Missing observability      | Developers, QA             |
| Scalability limitations    | Developers, Product Owners |
| Missing backend APIs       | Developers, QA             |

---

# 7. Conclusion

The Mustakleen platform involves multiple stakeholders with interconnected responsibilities.

Proper documentation, architecture understanding, and QA readiness are essential to ensure:

* stable system behavior
* maintainability
* scalability
* testing readiness
* future production migration
