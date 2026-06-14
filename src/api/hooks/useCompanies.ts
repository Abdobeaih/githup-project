import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '../endpoints'
import type { CompanyCreatePayload, CompanyUpdatePayload, CompanyBranchCreatePayload } from '../../types'

export const companyKeys = {
  all: ['companies'] as const,
  list: (params?: Record<string, any>) => ['companies', 'list', params] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
  stats: () => ['companies', 'stats'] as const,
  branches: (companyId: string) => ['companies', 'branches', companyId] as const,
}

export const useCompanies = (params?: Record<string, any>) =>
  useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => companiesApi.list(params),
  })

export const useCompany = (id: string) =>
  useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companiesApi.getById(id),
    enabled: !!id,
  })

export const useCompanyStats = () =>
  useQuery({
    queryKey: companyKeys.stats(),
    queryFn: () => companiesApi.getStats(),
  })

export const useCreateCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CompanyCreatePayload) => companiesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: companyKeys.all }),
  })
}

export const useUpdateCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompanyUpdatePayload }) => companiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: companyKeys.detail(id) })
      qc.invalidateQueries({ queryKey: companyKeys.all })
    },
  })
}

export const useDeleteCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => companiesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: companyKeys.all }),
  })
}

export const useApproveCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => companiesApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: companyKeys.all }),
  })
}

export const useRejectCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => companiesApi.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: companyKeys.all }),
  })
}

export const useCompanyBranches = (companyId: string) =>
  useQuery({
    queryKey: companyKeys.branches(companyId),
    queryFn: () => companiesApi.branches.list(companyId),
    enabled: !!companyId,
  })

export const useCreateBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: CompanyBranchCreatePayload }) =>
      companiesApi.branches.create(companyId, data),
    onSuccess: (_, { companyId }) =>
      qc.invalidateQueries({ queryKey: companyKeys.branches(companyId) }),
  })
}

export const useDeleteBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (branchId: string) => companiesApi.branches.delete(branchId),
    onSuccess: () => qc.invalidateQueries({ queryKey: companyKeys.all }),
  })
}
