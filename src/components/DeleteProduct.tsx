// The little trash can icon that deletes a product from the database
import { useMutation, useQueryClient } from 'react-query'
import { DeleteIcon } from '../svg/DeleteIcon'
import { deleteProduct } from '../api'
import { WarningIcon } from '../svg/WarningIcon'
import { useState } from 'react'

const DeleteProduct = ({ productId }: { productId: number }) => {
  const [showErrorTooltip, setShowErrorTooltip] = useState(false)

  const { mutate, isSuccess, isLoading, isError, error } = useMutation({
    mutationKey: ['deleteProduct', productId],
    mutationFn: deleteProduct
  })

  const queryClient = useQueryClient()

  if (isSuccess) {
    queryClient.invalidateQueries('products')
  }

  return (
    <div className='flex gap-2 items-center'>
      {isError && (
        <div
          onMouseOver={() => {
            setShowErrorTooltip(true)
          }}
          onMouseLeave={() => {
            setShowErrorTooltip(false)
          }}
          className='relative'
        >
          <WarningIcon />
          {showErrorTooltip && (
            <div className='absolute bg-white p-2 rounded-lg shadow-lg'>
              {(error as Error).message}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          mutate(productId)
        }}
        type='button'
      >
        {isLoading ? (
          <div className='border-t-transparent border-solid animate-spin rounded-full border-gray-400 border-2 w-5 h-5' />
        ) : (
          <DeleteIcon />
        )}
      </button>
    </div>
  )
}

export default DeleteProduct
