/**
 * Companies Service — API-first with localStorage fallback
 * Maps to: partner_companies, company_branches, company_admins
 */
import api from "../api/axios";
import * as db from "../data/db";

// ── Public: Browse companies ──────────────────────────────
export async function getCompanies(filters = {}) {
  try {
    const res = await api.get("/companies", { params: filters });
    return res.data;
  } catch {
    let list = db.getAllCompanies();
    if (filters.category) list = list.filter(c => c.category === filters.category);
    if (filters.city) list = list.filter(c => c.city === filters.city);
    if (filters.status) list = list.filter(c => c.status === filters.status);
    return { data: list };
  }
}

export async function getCompanyById(id) {
  try {
    const res = await api.get(`/companies/${id}`);
    return res.data;
  } catch {
    const company = db.findCompanyById(id);
    if (!company) throw new Error("Company not found");
    return { data: company };
  }
}

export async function getCompanyDiscounts(companyId) {
  try {
    const res = await api.get(`/companies/${companyId}/discounts`);
    return res.data;
  } catch {
    return { data: db.getDiscountsByCompany(companyId) };
  }
}

export async function getCompanyBranches(companyId) {
  try {
    const res = await api.get(`/companies/${companyId}/branches`);
    return res.data;
  } catch {
    return { data: db.getCompanyBranches(companyId) };
  }
}

// ── Protected: Mutations ─────────────────────────────────
export async function updateCompany(id, updates) {
  try {
    const res = await api.put(`/companies/${id}`, updates);
    return res.data;
  } catch {
    return { data: db.updateCompany(id, updates) };
  }
}

export async function createCompanyBranch(companyId, data) {
  try {
    const res = await api.post("/company-branches", { ...data, companyId });
    return res.data;
  } catch {
    return { data: db.createCompanyBranch({ ...data, company_id: companyId }) };
  }
}

export async function updateCompanyBranch(id, updates) {
  try {
    const res = await api.put(`/company-branches/${id}`, updates);
    return res.data;
  } catch {
    return { data: db.updateCompanyBranch(id, updates) };
  }
}

export async function deleteCompanyBranch(id) {
  try {
    const res = await api.delete(`/branches/${id}`);
    return res.data;
  } catch {
    db.deleteCompanyBranch(id);
    return { success: true };
  }
}

// ── Company Admins ─────────────────────────────────────────
export async function getCompanyAdmins(companyId) {
  try {
    const res = await api.get("/company-admins", { params: { companyId } });
    return res.data;
  } catch {
    return [];
  }
}

export async function addCompanyAdmin(data) {
  try {
    const res = await api.post("/company-admins", data);
    return res.data;
  } catch {
    return { data: { id: `CA-${Date.now()}`, ...data, created_at: new Date().toISOString() } };
  }
}

export async function removeCompanyAdmin(id) {
  try {
    const res = await api.delete(`/company-admins/${id}`);
    return res.data;
  } catch {
    return { success: true };
  }
}
