import { useQuery } from 'react-query'
import { useParams } from 'wouter'
import { fetchBrand } from '../api'
import { Card } from '@tremor/react'

const Brand = () => {
  const params = useParams()
  const brandId = params.id

  const {
    data: brand,
    isLoading,
    isError,
    error
  } = useQuery({
    queryFn: () => fetchBrand(Number(brandId)),
    queryKey: ['brand', brandId],
    enabled: !Number.isNaN(Number(brandId))
  })

  if (isLoading) return <div>Loading...</div>

  if (Number.isNaN(Number(brandId))) {
    return <h1>Invalid brand ID</h1>
  }

  if (isError) return <h1>Error: {(error as Error).message}</h1>

  return (
    <div className='flex items-center justify-center'>
      <Card>
        <h1>
          <span className='font-semibold'>Brand:</span> {brand?.data?.name}
        </h1>
      </Card>
    </div>
  )
}

export default Brand
