/**
 * Admin Service — API-first with localStorage fallback
 * Maps to: admin, users, companies, discounts + audit_logs
 */
import api from "../api/axios";
import * as db from "../data/db";

const AUDIT_KEY = "mustakleen_audit_logs";

// ── Users Management ─────────────────────────────────────
export async function getAllUsers(filters = {}) {
  try {
    const res = await api.get("/admin/users", { params: filters });
    return res.data;
  } catch {
    const users = db.getAllUsers();
    return { data: users };
  }
}

export async function updateUserStatus(id, status) {
  try {
    const res = await api.put(`/admin/users/${id}/status`, { status });
    return res.data;
  } catch {
    return { success: true };
  }
}

// ── Companies Moderation ─────────────────────────────────
export async function getAllCompaniesAdmin(filters = {}) {
  try {
    const res = await api.get("/admin/companies", { params: filters });
    return res.data;
  } catch {
    const companies = db.getAllCompanies();
    return { data: companies };
  }
}

export async function moderateCompany(id, action) {
  try {
    const res = await api.put(`/admin/companies/${id}/moderate`, action);
    return res.data;
  } catch {
    return { success: true };
  }
}

// ── Discounts Moderation ─────────────────────────────────
export async function getAllDiscountsAdmin(filters = {}) {
  try {
    const res = await api.get("/admin/discounts", { params: filters });
    return res.data;
  } catch {
    const discounts = db.getAllDiscounts();
    return { data: discounts };
  }
}

export async function moderateDiscount(id, action) {
  try {
    const res = await api.put(`/admin/discounts/${id}/moderate`, action);
    return res.data;
  } catch {
    return { success: true };
  }
}

// ── Audit Logs ───────────────────────────────────────────
export async function getAuditLogs(filters = {}) {
  try {
    const res = await api.get("/admin/audit-logs", { params: filters });
    return res.data;
  } catch {
    const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    let result = [...logs];
    if (filters.entity_type) result = result.filter(l => l.entity_type === filters.entity_type);
    if (filters.action) result = result.filter(l => l.action === filters.action);
    return { data: result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
  }
}

export async function logAdminAction(data) {
  const log = { id: `AUD-${Date.now()}`, ...data, created_at: new Date().toISOString() };
  const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
  logs.push(log);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
  return { data: log };
}
