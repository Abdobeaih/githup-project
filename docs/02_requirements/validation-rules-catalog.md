# Validation Rules Catalog

## Project Name

Mustakleen Platform

---

# 1. Introduction

This document defines the validation rules applied within the Mustakleen platform.

The rules support:

* data integrity
* user input validation
* security protection
* QA negative testing
* business rule enforcement

---

# 2. Authentication Validation Rules

---

## VR-001 — Email Validation

### Applies To

* Login
* Registration

### Rules

* Email is required.
* Email must follow valid format.
* Duplicate emails are not allowed.
* Leading/trailing spaces should be trimmed.

### Invalid Examples

* empty value
* invalidemail
* test@
* @gmail.com

---

## VR-002 — Password Validation

### Applies To

* Login
* Registration

### Rules

* Password is required.
* Password should contain at least 8 characters.
* Password should contain letters and numbers.

### Invalid Examples

* 123
* password
* empty value

---

## VR-003 — Confirm Password Validation

### Applies To

* Registration

### Rules

* Confirm password must match password.

---

# 3. User Data Validation Rules

---

## VR-004 — Name Validation

### Rules

* Name is required.
* Name should not contain only spaces.
* Name length should remain within acceptable limits.

---

## VR-005 — Phone Number Validation

### Rules

* Phone number should contain valid numeric values.
* Invalid symbols should be rejected.

---

## VR-006 — Governorate Validation

### Rules

* Governorate must exist within supported options.

---

# 4. Discount Validation Rules

---

## VR-007 — Discount Title Validation

### Rules

* Title is required.
* Empty titles are invalid.

---

## VR-008 — Discount Date Validation

### Rules

* Start date should not exceed end date.
* Expired discounts should not appear publicly.

---

## VR-009 — Discount Value Validation

### Rules

* Discount values must remain positive.
* Invalid discount percentages should be rejected.

---

## VR-010 — Discount Category Validation

### Rules

* Category selection is required.

---

# 5. Installment Validation Rules

---

## VR-011 — Installment Amount Validation

### Rules

* Installment amount must remain positive.
* Remaining balance should not become negative.

---

## VR-012 — Installment Status Validation

### Rules

* Paid installments should not remain marked unpaid.

---

# 6. Localization Validation Rules

---

## VR-013 — Language Selection Validation

### Rules

* Only supported languages should be selectable.
* RTL/LTR switching should remain synchronized.

---

# 7. Session Validation Rules

---

## VR-014 — Session Persistence Validation

### Rules

* Corrupted session data should trigger logout.
* Missing sessions should redirect to login.

---

# 8. Authorization Validation Rules

---

## VR-015 — Protected Route Validation

### Rules

* Unauthorized users must not access restricted routes.
* Role mismatches should trigger redirects.

---

# 9. File & Media Validation Rules

---

## VR-016 — Image Upload Validation

### Rules

* Only image formats should be accepted.
* Large files should be restricted.

---

# 10. Business Logic Validation Rules

---

## VR-017 — Approved Discount Visibility

### Rules

* Only approved discounts appear publicly.

---

## VR-018 — Loyalty Points Validation

### Rules

* Points increase only after successful redemption.

---

## VR-019 — Duplicate Redemption Validation

### Rules

* Invalid duplicate redemption behavior should be prevented.

---

# 11. Error Validation Rules

---

## VR-020 — Validation Error Handling

### Rules

* Invalid forms should block submission.
* Errors should display clearly.

---

# 12. QA Impact

These validation rules support:

* negative testing
* boundary testing
* security testing
* form validation testing
* exploratory testing

---

# 13. Conclusion

The validation rules establish the expected data integrity and input behavior across the Mustakleen platform.

They provide a critical foundation for:

* QA validation
* secure interactions
* business consistency
* reliable user workflows
