import { useMutation, useQueryClient } from 'react-query'
import { addImageToProduct } from '../api'

export const useAddImageToProduct = () => {
  const queryClient = useQueryClient()

  const { isLoading, isError, error, mutate, isSuccess } = useMutation({
    mutationKey: ['createProductImage'],
    mutationFn: addImageToProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      queryClient.invalidateQueries(['images'])
    }
  })

  return {
    isLoading,
    isError,
    error,
    mutate,
    isSuccess
  }
}
