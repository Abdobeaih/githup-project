# Activity Diagrams

## Project Name

Mustakleen Platform

---

# 1. Introduction

This document defines the primary activity diagrams within the Mustakleen platform.

Activity diagrams describe:

* business workflows
* decision paths
* operational flow logic
* process transitions
* user/system interactions

These diagrams support:

* business analysis
* QA planning
* exploratory testing
* UAT validation
* workflow tracing

---

# 2. User Registration Activity

```mermaid id="5q4lm2"
flowchart TD

    Start([Start])

    OpenSignup[Open Signup Page]

    EnterData[Enter Registration Data]

    ValidateData{Validation Successful?}

    ShowErrors[Display Validation Errors]

    CreateUser[Create User Record]

    PersistUser[Persist User Data]

    CreateSession[Initialize Session]

    RedirectDashboard[Redirect To Dashboard]

    End([End])

    Start --> OpenSignup
    OpenSignup --> EnterData
    EnterData --> ValidateData

    ValidateData -->|No| ShowErrors
    ShowErrors --> EnterData

    ValidateData -->|Yes| CreateUser
    CreateUser --> PersistUser
    PersistUser --> CreateSession
    CreateSession --> RedirectDashboard
    RedirectDashboard --> End
```

---

# 3. User Login Activity

```mermaid id="x7u2mt"
flowchart TD

    Start([Start])

    OpenLogin[Open Login Page]

    EnterCredentials[Enter Credentials]

    ValidateCredentials{Credentials Valid?}

    ShowAuthError[Show Authentication Error]

    CreateSession[Create Session]

    RedirectRole[Redirect Based On Role]

    End([End])

    Start --> OpenLogin
    OpenLogin --> EnterCredentials
    EnterCredentials --> ValidateCredentials

    ValidateCredentials -->|No| ShowAuthError
    ShowAuthError --> EnterCredentials

    ValidateCredentials -->|Yes| CreateSession
    CreateSession --> RedirectRole
    RedirectRole --> End
```

---

# 4. Discount Redemption Activity

```mermaid id="0n3vtm"
flowchart TD

    Start([Start])

    OpenDiscounts[Open Discounts Page]

    BrowseDiscounts[Browse Approved Discounts]

    SelectDiscount[Select Discount]

    Authenticated{Authenticated?}

    RedirectLogin[Redirect To Login]

    GeneratePromo[Generate Promo Code]

    CreateInvoice[Create Invoice]

    PersistRedemption[Persist Redemption]

    UpdateLoyalty[Update Loyalty Points]

    ShowConfirmation[Display Confirmation]

    End([End])

    Start --> OpenDiscounts
    OpenDiscounts --> BrowseDiscounts
    BrowseDiscounts --> SelectDiscount
    SelectDiscount --> Authenticated

    Authenticated -->|No| RedirectLogin
    RedirectLogin --> End

    Authenticated -->|Yes| GeneratePromo
    GeneratePromo --> CreateInvoice
    CreateInvoice --> PersistRedemption
    PersistRedemption --> UpdateLoyalty
    UpdateLoyalty --> ShowConfirmation
    ShowConfirmation --> End
```

---

# 5. Installment Payment Activity

```mermaid id="j2k9ph"
flowchart TD

    Start([Start])

    OpenInstallments[Open Installments Page]

    ViewSchedule[View Installment Schedule]

    SelectInstallment[Select Installment]

    SubmitPayment[Submit Payment]

    UpdateBalance[Update Remaining Balance]

    RefreshDashboard[Refresh Dashboard]

    End([End])

    Start --> OpenInstallments
    OpenInstallments --> ViewSchedule
    ViewSchedule --> SelectInstallment
    SelectInstallment --> SubmitPayment
    SubmitPayment --> UpdateBalance
    UpdateBalance --> RefreshDashboard
    RefreshDashboard --> End
```

---

# 6. Company Offer Creation Activity

```mermaid id="f9y7zn"
flowchart TD

    Start([Start])

    OpenDashboard[Open Company Dashboard]

    CreateOffer[Create Discount Offer]

    ValidateOffer{Offer Valid?}

    ShowValidationErrors[Show Validation Errors]

    SaveOffer[Save Offer]

    PendingApproval[Set Pending Approval]

    End([End])

    Start --> OpenDashboard
    OpenDashboard --> CreateOffer
    CreateOffer --> ValidateOffer

    ValidateOffer -->|No| ShowValidationErrors
    ShowValidationErrors --> CreateOffer

    ValidateOffer -->|Yes| SaveOffer
    SaveOffer --> PendingApproval
    PendingApproval --> End
```

---

# 7. Admin Moderation Activity

```mermaid id="s6m8wt"
flowchart TD

    Start([Start])

    OpenAdminDashboard[Open Admin Dashboard]

    ReviewDiscounts[Review Pending Discounts]

    SelectDecision{Approve Or Reject?}

    ApproveOffer[Approve Offer]

    RejectOffer[Reject Offer]

    UpdateVisibility[Update Public Visibility]

    End([End])

    Start --> OpenAdminDashboard
    OpenAdminDashboard --> ReviewDiscounts
    ReviewDiscounts --> SelectDecision

    SelectDecision -->|Approve| ApproveOffer
    SelectDecision -->|Reject| RejectOffer

    ApproveOffer --> UpdateVisibility
    RejectOffer --> UpdateVisibility

    UpdateVisibility --> End
```

---

# 8. Language Switching Activity

```mermaid id="r5k2dj"
flowchart TD

    Start([Start])

    UserClicksLanguage[User Clicks Language Switch]

    UpdateLanguageState[Update Language State]

    UpdateDirection[Update RTL/LTR Direction]

    ReRenderUI[Re-render UI]

    End([End])

    Start --> UserClicksLanguage
    UserClicksLanguage --> UpdateLanguageState
    UpdateLanguageState --> UpdateDirection
    UpdateDirection --> ReRenderUI
    ReRenderUI --> End
```

---

# 9. Session Restoration Activity

```mermaid id="v4n8qa"
flowchart TD

    Start([Application Start])

    CheckSession[Check sessionStorage]

    SessionExists{Session Exists?}

    RestoreSession[Restore Session]

    RedirectLogin[Redirect To Login]

    RenderApp[Render Application]

    End([End])

    Start --> CheckSession
    CheckSession --> SessionExists

    SessionExists -->|Yes| RestoreSession
    SessionExists -->|No| RedirectLogin

    RestoreSession --> RenderApp
    RedirectLogin --> RenderApp

    RenderApp --> End
```

---

# 10. Workflow Risks

| Workflow     | Risk                      |
| ------------ | ------------------------- |
| Registration | Duplicate accounts        |
| Login        | Corrupted session         |
| Redemption   | Invalid discount state    |
| Installments | Incorrect balances        |
| Moderation   | Unauthorized approvals    |
| Localization | Rendering inconsistencies |

---

# 11. QA Impact

These activity diagrams support:

* end-to-end testing
* business workflow validation
* regression testing
* exploratory testing
* user journey analysis
* automation planning

---

# 12. Conclusion

The activity diagrams define the operational workflows of the Mustakleen platform and provide:

* business process visibility
* workflow tracing
* QA preparation
* system behavior understanding
