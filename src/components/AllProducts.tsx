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
    <div className='flex flex-col items-center justify-center mb-8 px-8 2xl:w-3/4 w-full sm'>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className='hidden lg:table-cell'>
                SKU
              </TableHeaderCell>
              <TableHeaderCell className='hidden md:table-cell'>
                Price
              </TableHeaderCell>
              <TableHeaderCell className='hidden xl:table-cell'>
                Weight
              </TableHeaderCell>
              <TableHeaderCell className='hidden sm:table-cell'>
                Type
              </TableHeaderCell>
              <TableHeaderCell className='hidden md:table-cell'>
                Inventory
              </TableHeaderCell>
              <TableHeaderCell className='hidden lg:table-cell'>
                Brand
              </TableHeaderCell>
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
