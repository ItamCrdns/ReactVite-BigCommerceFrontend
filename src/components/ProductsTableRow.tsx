import {
  NumberInput,
  Select,
  SelectItem,
  TableCell,
  TableRow,
  TextInput
} from '@tremor/react'
import type { Product } from '../types/Product.interface'
import { useState } from 'react'
import { Link } from 'wouter'
import { EditIcon } from '../svg/EditIcon'
import DeleteProduct from './DeleteProduct'
import { CheckCircleIcon } from '../svg/CheckCircleIcon'
import { useMutation, useQueryClient } from 'react-query'
import { updateProduct } from '../api'
import { useWarnings } from '../hooks/useWarnings'
import { WarningIcon } from '../svg/WarningIcon'

// The table row for each product in the products table
// This component uses very similar logic of the CreateProduct component to handle the editing of a product

const ProductsTableRow = ({ product }: { product: Product }) => {
  const [editMode, setEditMode] = useState({
    edit: false,
    selectedProduct: 0
  })

  const [newProduct, setNewProduct] = useState<Product>(product)
  const [showErrorTooltip, setShowErrorTooltip] = useState(false)

  const { warnings, handleSetWarning, handleFilterWarning } = useWarnings()

  const queryClient = useQueryClient()

  const { isLoading, isError, error, mutate } = useMutation({
    mutationKey: ['updateProduct', editMode.selectedProduct],
    mutationFn: updateProduct,
    onSuccess: () => {
      // Docs say. I thought this was deprecated?
      queryClient.invalidateQueries(['products'])
    }
  })

  return (
    <TableRow>
      <TableCell className='w-[200px] h-20'>
        {editMode.edit ? (
          <TextInput
            defaultValue={newProduct.name}
            placeholder='Name'
            onChange={(event) => {
              const nameValue = event.target.value

              if (nameValue === '') {
                handleSetWarning('Name is required', 'name')
              } else {
                handleFilterWarning('name')
              }

              setNewProduct({ ...newProduct, name: nameValue })
            }}
            error={warnings.some((warning) => warning.field === 'name')}
            // errorMessage='Name is required'
          />
        ) : (
          <Link className='font-semibold' href={`/products/${product.id}`}>
            {product.name}
          </Link>
        )}
      </TableCell>
      <TableCell className='w-[200px]'>
        {editMode.edit ? (
          <TextInput
            defaultValue={newProduct.sku}
            placeholder='SKU'
            onChange={(event) => {
              const skuValue = event.target.value

              if (skuValue === '') {
                handleSetWarning('SKU is required', 'sku')
              } else {
                handleFilterWarning('sku')
              }

              setNewProduct({ ...newProduct, sku: skuValue })
            }}
            error={warnings.some((warning) => warning.field === 'sku')}
            // errorMessage='SKU is required'
          />
        ) : (
          product.sku
        )}
      </TableCell>
      <TableCell className='w-[200px]'>
        {editMode.edit ? (
          <TextInput
            defaultValue={newProduct.price.toString()}
            placeholder='Price'
            onChange={(event) => {
              const priceValue = event.target.value

              if (priceValue === '') {
                handleSetWarning('Price is required', 'price')
              } else {
                handleFilterWarning('price')
              }

              setNewProduct({
                ...newProduct,
                price: Number(priceValue)
              })
            }}
            error={warnings.some((w) => w.field === 'price')}
            // errorMessage={warnings.find((w) => w.field === 'price')?.message}
          />
        ) : (
          product.price
        )}
      </TableCell>
      <TableCell className='w-[200px]'>
        {editMode.edit ? (
          <NumberInput
            defaultValue={newProduct.weight.toString()}
            placeholder='Weight'
            onChange={(event) => {
              const weightValue = event.target.value
              const isWeightDecimal = Number(weightValue) % 1 !== 0

              if (weightValue === '') {
                handleSetWarning('Weight is required', 'weight')
              } else {
                handleFilterWarning('weight')
                if (isWeightDecimal) {
                  handleSetWarning('Weight must be a whole number', 'weight')
                } else {
                  handleFilterWarning('weight')
                }
              }

              setNewProduct({
                ...newProduct,
                weight: Number(weightValue)
              })
            }}
            error={warnings.some((w) => w.field === 'weight')}
            // errorMessage={warnings.find((w) => w.field === 'weight')?.message}
          />
        ) : (
          `${product.weight}kg`
        )}
      </TableCell>
      <TableCell className='w-[200px]'>
        {editMode.edit ? (
          <Select
            defaultValue={newProduct.type === 'physical' ? '1' : '2'}
            onValueChange={(value: string) => {
              if (value === '1') {
                setNewProduct({ ...newProduct, type: 'physical' })
              } else {
                setNewProduct({ ...newProduct, type: 'digital' })
              }
            }}
          >
            <SelectItem value='1'>Physical</SelectItem>
            <SelectItem value='2'>Digital</SelectItem>
          </Select>
        ) : (
          <span className='capitalize'>{product.type}</span>
        )}
      </TableCell>
      <TableCell className='w-[200px]'>
        {editMode.edit ? (
          <NumberInput
            defaultValue={newProduct.inventory_level.toString()}
            placeholder='Inventory'
            onChange={(event) => {
              const inventoryValue = event.target.value
              const isInventoryDecimal = Number(inventoryValue) % 1 !== 0

              if (inventoryValue === '') {
                handleSetWarning(
                  'Inventory level is required',
                  'inventory_level'
                )
              } else {
                handleFilterWarning('inventory_level')
                if (isInventoryDecimal) {
                  handleSetWarning(
                    'Inventory level must be a whole number',
                    'inventory_level'
                  )
                } else {
                  handleFilterWarning('inventory_level')
                }
              }

              setNewProduct({
                ...newProduct,
                inventory_level: Number(inventoryValue)
              })
            }}
            error={warnings.some((w) => w.field === 'inventory_level')}
            // errorMessage={
            //   warnings.find((w) => w.field === 'inventory_level')?.message
            // }
          />
        ) : (
          product.inventory_level
        )}
      </TableCell>
      <TableCell className='w-[200px]'>
        <Link className='font-semibold' href={`/brands/${product.brand_id}`}>
          {product.brand_id}
        </Link>
      </TableCell>
      <TableCell className='space-x-2 w-[300px]'>
        <div className='flex gap-2 items-center'>
          {isLoading && (
            <div className='border-t-transparent border-solid animate-spin rounded-full border-gray-400 border-2 w-5 h-5' />
          )}
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
          {editMode.edit ? (
            <button
              onClick={() => {
                mutate({
                  productId: editMode.selectedProduct,
                  product: newProduct
                })
                setEditMode({ edit: false, selectedProduct: 0 })
              }}
              type='button'
            >
              <CheckCircleIcon />
            </button>
          ) : (
            <button
              onClick={() => {
                setEditMode({
                  edit: !editMode.edit,
                  selectedProduct: product.id
                })
              }}
              type='button'
            >
              <EditIcon />
            </button>
          )}
          <DeleteProduct productId={product.id} />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default ProductsTableRow
