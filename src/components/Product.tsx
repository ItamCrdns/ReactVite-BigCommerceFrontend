import { useQuery } from 'react-query'
import { useParams } from 'wouter'
import { fetchProduct, fetchProductImages } from '../api'
import { Badge, Button, Card } from '@tremor/react'
import { useImagePreview } from '../hooks/useImagePreview'
import { useState } from 'react'
import { ImageUploadCard } from './ImageUploadCard'
import { useAddImageToProduct } from '../hooks/useAddImageToProduct'

const Product = () => {
  const params = useParams()
  const productIdParams = params.id

  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const { image, picturePreview, inputRef, updateImageToUpload } =
    useImagePreview()

  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery({
    queryFn: () => fetchProduct(Number(productIdParams)),
    queryKey: ['product', productIdParams],
    enabled: !Number.isNaN(Number(productIdParams)) // Disable the query if the product ID is not a number
  })

  const productId = product?.data?.data.id

  const { data: images, isLoading: isLoadingImages } = useQuery({
    queryFn: () => fetchProductImages(Number(productIdParams)),
    queryKey: ['images', productIdParams],
    enabled: !!productId
  })

  const {
    isLoading: isLoadingImage,
    isError: isErrorImage,
    error: errorImage,
    mutate: mutateImage,
    isSuccess: isSuccessImage
  } = useAddImageToProduct()

  if (isLoading) return <div>Loading...</div>

  if (Number.isNaN(Number(productIdParams))) {
    return <h1>Invalid product ID</h1>
  }

  if (isError) return <h1>Error: {(error as Error).message}</h1>

  return (
    <div className='flex items-center justify-center px-8 pb-8'>
      <Card className='flex items-center justify-center flex-col gap-4'>
        <div className='flex gap-4'>
          <h1 className='font-semibold'>{product?.data?.data.name}</h1>
          <span>-</span>
          <span>{product?.data?.data.sku}</span>
        </div>
        <div className='flex gap-4'>
          <span>${product?.data?.data.price}</span>
          <span>{product?.data?.data.type}</span>
        </div>
        {isLoadingImages && <div>Loading images...</div>}
        <div className='flex gap-4 flex-col'>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            hidden
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0]
              if (file !== undefined) {
                updateImageToUpload(file)
              }
            }}
          />
          {images?.statusCode === 200 && (
            <>
              <div className='grid grid-cols-4 gap-4'>
                {images.data?.data.map((image) => (
                  <div
                    className='flex items-center justify-center'
                    key={image.id}
                  >
                    <img
                      src={image.url_standard}
                      alt={image.description}
                      className='w-40 h-40 object-cover rounded-md'
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setShowImageUploadModal(!showImageUploadModal)
                }}
                variant='secondary'
              >
                {showImageUploadModal ? 'Close' : 'Add another image'}
              </Button>
            </>
          )}
          {images?.statusCode === 204 && (
            <div className='flex items-center gap-4 flex-col'>
              <Badge color='orange'>No images found</Badge>
              <Button
                onClick={() => {
                  setShowImageUploadModal(!showImageUploadModal)
                }}
                variant='secondary'
              >
                {showImageUploadModal ? 'Close' : 'Add an image'}
              </Button>
            </div>
          )}
          {showImageUploadModal && (
            <>
              <div className='flex'>
                <ImageUploadCard
                  picturePreview={picturePreview}
                  inputRef={inputRef}
                  uploadText='Upload an image for this product'
                />
              </div>
              {image && (
                <Button
                  onClick={() => {
                    mutateImage({
                      productId: Number(productIdParams),
                      picture: image
                    })
                  }}
                >
                  Upload this image
                </Button>
              )}
            </>
          )}
          {isLoadingImage && (
            <p className='text-center'>Uploading image... Please wait</p>
          )}
          {isErrorImage && (
            <p className='text-center text-red-500'>
              Error: {(errorImage as Error).message}
            </p>
          )}
          {isSuccessImage && (
            <p className='text-center'>Image uploaded successfully</p>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Product
