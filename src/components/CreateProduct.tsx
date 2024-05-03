import {
  Button,
  Card,
  NumberInput,
  Select,
  SelectItem,
  TextInput
} from '@tremor/react'
import { useCallback, useState } from 'react'
import { useWarnings } from '../hooks/useWarnings'
import { createProduct } from '../api'
import type { Product } from '../types/Product.interface'
import { useMutation, useQueryClient } from 'react-query'
import { ImageUploadCard } from './ImageUploadCard'
import { useImagePreview } from '../hooks/useImagePreview'
import { useAddImageToProduct } from '../hooks/useAddImageToProduct'

const CreateProduct = () => {
  const [selectedType, setSelectedType] = useState('physical')
  const { image, picturePreview, inputRef, updateImageToUpload } =
    useImagePreview()

  const { warnings, handleSetWarning, handleFilterWarning } = useWarnings()

  const createProductCallback = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(event.target as HTMLFormElement)
      formData.append('type', selectedType)
      const data = Object.fromEntries(formData)

      const { name, sku, price, weight, inventory_level, brand_name } = data

      if (name === '') {
        handleSetWarning('Name is required', 'name')
      } else {
        handleFilterWarning('name')
      }

      if (sku === '') {
        handleSetWarning('SKU is required', 'sku')
      } else {
        handleFilterWarning('sku')
      }

      if (price === '') {
        handleSetWarning('Price is required', 'price')
      } else {
        handleFilterWarning('price')
      }

      const isWeightDecimal = Number(weight) % 1 !== 0

      if (weight === '') {
        handleSetWarning('Weight is required', 'weight')
      } else {
        handleFilterWarning('weight')
        if (isWeightDecimal) {
          handleSetWarning('Weight must be a whole number', 'weight')
        } else {
          handleFilterWarning('weight')
        }
      }

      const isInventoryDecimal = Number(inventory_level) % 1 !== 0

      if (inventory_level === '') {
        handleSetWarning('Inventory level is required', 'inventory_level')
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

      if (brand_name === '') {
        handleSetWarning('Brand name is required', 'brand_name')
      } else {
        handleFilterWarning('brand_name')
      }

      const newProduct = {
        name: formData.get('name') as string,
        sku: formData.get('sku') as string,
        price: Number(formData.get('price')),
        inventory_level: Number(formData.get('inventory_level')),
        brand_name: formData.get('brand_name') as string,
        type: selectedType,
        weight: Number(formData.get('weight'))
      }

      return createProduct(newProduct as Product)
    },
    [handleFilterWarning, handleSetWarning, selectedType]
  )

  const queryClient = useQueryClient()

  const { isLoading, isError, error, mutate, isSuccess } = useMutation({
    mutationKey: ['createProduct', selectedType],
    mutationFn: createProductCallback,
    onSuccess: (res) => {
      const newProductId = res.data?.data.id as number
      queryClient.invalidateQueries('products')

      if (image !== null && newProductId !== 0) {
        mutateImage({ productId: newProductId, picture: image })
      }
    }
  })

  const {
    isLoading: isLoadingImage,
    isError: isErrorImage,
    error: errorImage,
    mutate: mutateImage,
    isSuccess: isSuccessImage
  } = useAddImageToProduct()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate(event)
  }

  if (isSuccess) {
    return (
      <div className='flex flex-col items-center justify-center mb-8'>
        <Card>
          <h1 className='font-semibold text-xl text-center'>
            Product created!
          </h1>
          <p className='text-xs text-center'>
            Your product has been successfully created
          </p>
          {isSuccessImage && (
            <p className='text-xs text-center'>
              Your product image has been successfully uploaded
            </p>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center mb-8'>
      <Card>
        <h1 className='font-semibold text-xl text-center'>
          Create a new product
        </h1>
        <p className='text-xs text-center pb-8'>
          Please fill all the fields below
        </p>
        <form onSubmit={onSubmit} className='space-y-4'>
          <TextInput
            placeholder='Name'
            name='name'
            error={warnings.some((w) => w.field === 'name')}
            errorMessage='Name is required'
          />
          <TextInput
            placeholder='SKU'
            name='sku'
            error={warnings.some((w) => w.field === 'sku')}
            errorMessage='SKU is required'
          />
          <TextInput
            placeholder='Price'
            name='price'
            error={warnings.some((w) => w.field === 'price')}
            errorMessage={warnings.find((w) => w.field === 'price')?.message}
          />
          <NumberInput
            placeholder='Weight'
            name='weight'
            error={warnings.some((w) => w.field === 'weight')}
            errorMessage={warnings.find((w) => w.field === 'weight')?.message}
          />
          <Select
            defaultValue='1'
            onValueChange={(value: string) => {
              if (value === '1') {
                setSelectedType('physical')
              } else {
                setSelectedType('digital')
              }
            }}
          >
            <SelectItem value='1'>Physical</SelectItem>
            <SelectItem value='2'>Digital</SelectItem>
          </Select>
          <NumberInput
            placeholder='Inventory'
            name='inventory_level'
            error={warnings.some((w) => w.field === 'inventory_level')}
            errorMessage='Inventory level is required'
          />
          <TextInput
            placeholder='Brand name'
            name='brand_name'
            error={warnings.some((w) => w.field === 'brand_name')}
            errorMessage='Brand name is required'
          />
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
          <ImageUploadCard
            picturePreview={picturePreview}
            inputRef={inputRef}
          />
          <div className='flex self-center justify-center text-center'>
            <Button type='submit'>Submit</Button>
          </div>
          {isLoading && <p className='text-center'>Creating product...</p>}
          {isLoadingImage && <p className='text-center'>Uploading image...</p>}
          {isError && (
            <div className='flex justify-center items-center'>
              <div className='w-[250px] flex justify-center items-center'>
                <p className='text-red-500 text-center'>
                  {(error as Error)?.message}
                </p>
              </div>
            </div>
          )}
          {isErrorImage && (
            <div className='flex justify-center items-center'>
              <div className='w-[250px] flex justify-center items-center'>
                <p className='text-red-500 text-center'>
                  {(errorImage as Error)?.message}
                </p>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}

export default CreateProduct
