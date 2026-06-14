# Sequence Diagrams

## Project Name

Mustakleen Platform

---

# 1. Introduction

This document defines the primary sequence diagrams within the Mustakleen platform.

Sequence diagrams describe:

* execution flow
* component interaction order
* service communication
* state updates
* persistence operations

These diagrams support:

* QA tracing
* debugging
* automation understanding
* architectural analysis
* business flow validation

---

# 2. User Login Sequence

```mermaid id="9q0ghx"
sequenceDiagram

    actor User
    participant LoginPage
    participant AuthContext
    participant dbjs
    participant sessionStorage

    User->>LoginPage: Enter credentials
    LoginPage->>AuthContext: submitLogin()

    AuthContext->>dbjs: validateUser()

    dbjs-->>AuthContext: authenticated user

    AuthContext->>sessionStorage: store session

    sessionStorage-->>AuthContext: success

    AuthContext-->>LoginPage: authenticated state

    LoginPage-->>User: redirect to dashboard
```

---

# 3. User Registration Sequence

```mermaid id="0w5ghs"
sequenceDiagram

    actor User
    participant SignupPage
    participant dbjs
    participant localStorage
    participant AuthContext

    User->>SignupPage: Submit registration form

    SignupPage->>dbjs: validateUserData()

    dbjs-->>SignupPage: validation success

    SignupPage->>dbjs: createUser()

    dbjs->>localStorage: persist user

    localStorage-->>dbjs: success

    dbjs-->>SignupPage: user created

    SignupPage->>AuthContext: initializeSession()

    AuthContext-->>User: redirect to dashboard
```

---

# 4. Discount Redemption Sequence

```mermaid id="u3r9jp"
sequenceDiagram

    actor User
    participant DiscountsBrowse
    participant AuthContext
    participant dbjs
    participant localStorage

    User->>DiscountsBrowse: Click redeem

    DiscountsBrowse->>AuthContext: validateSession()

    AuthContext-->>DiscountsBrowse: authenticated

    DiscountsBrowse->>dbjs: redeemDiscount()

    dbjs->>dbjs: generatePromoCode()

    dbjs->>dbjs: createInvoice()

    dbjs->>localStorage: persist redemption

    localStorage-->>dbjs: success

    dbjs-->>DiscountsBrowse: redemption completed

    DiscountsBrowse-->>User: display invoice & promo
```

---

# 5. Installment Payment Sequence

```mermaid id="57j7xg"
sequenceDiagram

    actor User
    participant Installments
    participant dbjs
    participant localStorage

    User->>Installments: Mark installment as paid

    Installments->>dbjs: updateInstallment()

    dbjs->>dbjs: recalculateBalances()

    dbjs->>localStorage: persist updates

    localStorage-->>dbjs: success

    dbjs-->>Installments: updated balances

    Installments-->>User: refresh UI
```

---

# 6. Company Discount Creation Sequence

```mermaid id="5ny6ka"
sequenceDiagram

    actor Company
    participant DiscountManagement
    participant dbjs
    participant localStorage

    Company->>DiscountManagement: Create discount

    DiscountManagement->>dbjs: validateDiscount()

    dbjs-->>DiscountManagement: validation success

    DiscountManagement->>dbjs: createDiscount()

    dbjs->>localStorage: persist offer

    localStorage-->>dbjs: success

    dbjs-->>DiscountManagement: pending approval
```

---

# 7. Admin Approval Sequence

```mermaid id="zkz2j7"
sequenceDiagram

    actor Admin
    participant ApprovalManagement
    participant dbjs
    participant localStorage

    Admin->>ApprovalManagement: Approve discount

    ApprovalManagement->>dbjs: approveDiscount()

    dbjs->>localStorage: update approval state

    localStorage-->>dbjs: success

    dbjs-->>ApprovalManagement: approved

    ApprovalManagement-->>Admin: confirmation
```

---

# 8. Language Switching Sequence

```mermaid id="cw5r9m"
sequenceDiagram

    actor User
    participant LanguageContext
    participant localStorage
    participant UI

    User->>LanguageContext: changeLanguage()

    LanguageContext->>localStorage: persist language

    localStorage-->>LanguageContext: success

    LanguageContext->>UI: update translations

    UI-->>User: re-render localized UI
```

---

# 9. Session Restoration Sequence

```mermaid id="9q8g7t"
sequenceDiagram

    participant App
    participant AuthContext
    participant sessionStorage

    App->>AuthContext: initialize app

    AuthContext->>sessionStorage: restore session

    sessionStorage-->>AuthContext: session data

    AuthContext-->>App: authenticated state restored
```

---

# 10. Sequence Flow Risks

| Flow           | Risk                         |
| -------------- | ---------------------------- |
| Login          | Corrupted session            |
| Registration   | Duplicate accounts           |
| Redemption     | Inconsistent persistence     |
| Installments   | Invalid balance updates      |
| Admin Approval | Unauthorized moderation      |
| Localization   | State synchronization issues |

---

# 11. QA Impact

These sequence diagrams support:

* end-to-end tracing
* QA test design
* automation planning
* debugging
* regression analysis
* state validation

---

# 12. Conclusion

The sequence diagrams define the operational execution flow of the Mustakleen platform.

They provide detailed insight into:

* interaction order
* state changes
* persistence operations
* user workflows
* component communication
