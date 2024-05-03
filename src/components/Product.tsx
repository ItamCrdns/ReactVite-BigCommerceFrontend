import { useQuery } from 'react-query'
import { useParams } from 'wouter'
import { fetchProduct, fetchProductImages } from '../api'
import { Badge, Button, Card } from '@tremor/react'

const Product = () => {
  const params = useParams()
  const productId = params.id

  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery({
    queryFn: () => fetchProduct(Number(productId)),
    queryKey: ['product', productId],
    enabled: !Number.isNaN(Number(productId)) // Disable the query if the product ID is not a number
  })

  const projectId = product?.data?.data.id

  const { data: images, isLoading: isLoadingImages } = useQuery({
    queryFn: () => fetchProductImages(Number(productId)),
    queryKey: ['images', productId],
    enabled: !!projectId
  })

  if (isLoading) return <div>Loading...</div>

  if (Number.isNaN(Number(productId))) {
    return <h1>Invalid product ID</h1>
  }

  if (isError) return <h1>Error: {(error as Error).message}</h1>

  return (
    <div className='flex items-center justify-center'>
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
        <div className='flex gap-4'>
          {images?.statusCode === 200 &&
            images?.data?.data.map((image) => {
              return (
                <img
                  key={image.id}
                  src={image.url_standard}
                  alt={image.description}
                  className='w-40 h-40 object-cover'
                />
              )
            })}
          {images?.statusCode === 204 && (
            <div className='flex items-center gap-4 flex-col'>
              <Badge color='orange'>No images found</Badge>
              <Button variant='secondary'>Add an image</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Product
