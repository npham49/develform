import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { submissionsApi } from '../lib/api'

export function useSubmissions(formId: number, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['submissions', 'form', formId, page, limit],
    queryFn: () => submissionsApi.getByFormId(formId, page, limit),
    enabled: !!formId,
  })
}

export function useSubmission(id: number) {
  return useQuery({
    queryKey: ['submissions', id],
    queryFn: () => submissionsApi.getById(id).then(res => res.submission),
    enabled: !!id,
  })
}

export function useSubmissionSuccess(formId: number, submissionId: number, token: string) {
  return useQuery({
    queryKey: ['submissions', 'success', formId, submissionId, token],
    queryFn: () => submissionsApi.getSuccess(formId, submissionId, token),
    enabled: !!(formId && submissionId && token),
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formId, data }: { formId: number; data: any }) => 
      submissionsApi.create(formId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['submissions', 'form', variables.formId] 
      })
    },
  })
}