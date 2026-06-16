/**
 * Enrollment Service — API-first with local db fallback
 * Maps to: /api/medical-centers, /api/banks, /api/enrollments
 */
import api from "../api/axios";
import * as db from "../data/db";

/**
 * Normalize a record from API response (MongoDB _id → id, etc.)
 */
function normalizeRecord(record) {
  if (!record) return record;
  const normalized = { ...record };
  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id;
  }
  return normalized;
}

function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeRecord);
}

/**
 * Fetch all medical centers from API, fallback to local db
 */
export async function getMedicalCenters() {
  try {
    const res = await api.get("/medical-centers");
    const data = res.data?.data || res.data || [];
    return normalizeArray(data);
  } catch {
    return db.getAllMedicalCenters();
  }
}

/**
 * Fetch medical centers filtered by governorate
 */
export async function getMedicalCentersByGovernorate(governorate) {
  try {
    const res = await api.get("/medical-centers", {
      params: { governorate },
    });
    const data = res.data?.data || res.data || [];
    return normalizeArray(data);
  } catch {
    return db.getMedicalCentersByGovernorate(governorate);
  }
}

/**
 * Fetch all banks from API, fallback to local db
 */
export async function getBanks() {
  try {
    const res = await api.get("/banks");
    const data = res.data?.data || res.data || [];
    return normalizeArray(data);
  } catch {
    return db.getAllBanks();
  }
}

/**
 * Fetch banks filtered by governorate
 */
export async function getBanksByGovernorate(governorate) {
  try {
    const res = await api.get("/banks", {
      params: { governorate },
    });
    const data = res.data?.data || res.data || [];
    return normalizeArray(data);
  } catch {
    return db.getBanksByGovernorate(governorate);
  }
}

/**
 * Enroll user in a service (medical / financial / combined)
 */
export async function enrollUserInService(userId, { service_type, center_id, bank_id }) {
  try {
    const res = await api.post("/enrollments", {
      service_type,
      center_id: center_id || undefined,
      bank_id: bank_id || undefined,
    });
    return res.data?.data || res.data;
  } catch {
    return db.enrollUserInService(userId, { service_type, center_id, bank_id });
  }
}

/**
 * Get enrollments for the current user
 */
export async function getUserEnrollments(userId) {
  try {
    const res = await api.get("/enrollments/my");
    const data = res.data?.data || res.data || [];
    return normalizeArray(data);
  } catch {
    return db.getUserEnrollments(userId);
  }
}

/**
 * Confirm an enrollment subscription
 */
export async function confirmEnrollmentSubscription(
  enrollmentId,
  { name, dob, phone, dataUseAgree, termsAgree }
) {
  try {
    const res = await api.post("/enrollments/confirm", {
      enrollment_id: enrollmentId,
      name,
      dob,
      phone,
      agreeDataUse: dataUseAgree,
      agreeTerms: termsAgree,
    });
    return res.data?.data || res.data;
  } catch {
    return db.confirmEnrollmentSubscription(enrollmentId, {
      name,
      dob,
      phone,
      dataUseAgree,
      termsAgree,
    });
  }
}
