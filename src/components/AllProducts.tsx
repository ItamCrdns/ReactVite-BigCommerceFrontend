import { useInfiniteQuery } from 'react-query'
import { fetchAllProducts } from '../api'
import {
  Card,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react'
import React, { useCallback, useRef } from 'react'
import ProductsTableRow from './ProductsTableRow'
import { Redirect } from 'wouter'

const AllProducts = () => {
  const observer = useRef<IntersectionObserver | null>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isError, error } =
    useInfiniteQuery({
      queryFn: ({ pageParam = 1 }) => fetchAllProducts({ pageParam }),
      queryKey: ['products'],
      getNextPageParam: (lastPage) => lastPage.nextPage
    })

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, isLoading, hasNextPage]
  )

  if (isLoading) return <div>Loading...</div>

  if (isError) {
    const errorValue = error as Error
    if (errorValue.message === 'Unauthorized') {
      return <Redirect to='/login' />
    }
  }

  return (
    <div className='flex flex-col items-center justify-center mb-8'>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>SKU</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Weight</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Inventory</TableHeaderCell>
              <TableHeaderCell>Brand</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.pages.map((product) => (
              <React.Fragment key={product.currentPage}>
                {product.data.map((product) => (
                  <React.Fragment key={product.id}>
                    <ProductsTableRow product={product} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className='text-center' ref={lastElementRef}>
          .
        </div>
      </Card>
    </div>
  )
}

export default AllProducts
