import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { versionsApi } from '../lib/api'

export function useVersions(formId: number) {
  return useQuery({
    queryKey: ['versions', formId],
    queryFn: () => versionsApi.getByFormId(formId).then(res => res.versions),
    enabled: !!formId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useVersion(formId: number, versionId: number) {
  return useQuery({
    queryKey: ['versions', formId, versionId],
    queryFn: () => versionsApi.getById(formId, versionId).then(res => res.version),
    enabled: !!formId && !!versionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useVersionSchema(formId: number, versionId: number) {
  return useQuery({
    queryKey: ['versions', formId, versionId, 'schema'],
    queryFn: () => versionsApi.getSchema(formId, versionId),
    enabled: !!formId && !!versionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateVersion(formId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionData: { title: string; description?: string; based_on: number }) =>
      versionsApi.create(formId, versionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', formId] })
    },
  })
}

export function useUpdateVersion(formId: number, versionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionData: any) => versionsApi.update(formId, versionId, versionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', formId] })
      queryClient.invalidateQueries({ queryKey: ['versions', formId, versionId] })
    },
  })
}

export function useMakeVersionLive(formId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionId: number) => versionsApi.makeLive(formId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', formId] })
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}