import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formsApi } from '../lib/api'

export function useForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll().then(res => res.forms),
  })
}

export function useForm(id: number) {
  return useQuery({
    queryKey: ['forms', id],
    queryFn: () => formsApi.getById(id).then(res => res.form),
    enabled: !!id,
  })
}

export function useFormSchema(id: number) {
  return useQuery({
    queryKey: ['forms', id, 'schema'],
    queryFn: () => formsApi.getSchema(id),
    enabled: !!id,
  })
}

export function useCreateForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: formsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}

export function useUpdateForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & any) => 
      formsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      queryClient.invalidateQueries({ queryKey: ['forms', variables.id] })
    },
  })
}

export function useDeleteForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: formsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })
}