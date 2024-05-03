import type { Brand } from '../types/Brand.interface'
import type { Image } from '../types/Image.interface'
import type { MetaData } from '../types/MetaData.interface'
import type { OperationResult } from '../types/OperationResult.interface'
import type { Product } from '../types/Product.interface'

const LIMIT = 50

export const fetchAllProducts = async ({
  pageParam
}: { pageParam: number }): Promise<{
  data: Product[]
  currentPage: number
  nextPage: number | null
}> => {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/products/all?page=${pageParam}&limit=${LIMIT}`,
    {
      credentials: 'include'
    }
  )

  if (res.status === 401) {
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error('Something went wrong fetching products')
  }

  const data: MetaData<Product[]> = await res.json()

  return {
    data: data.data.slice(pageParam - 1, pageParam + LIMIT),
    currentPage: pageParam,
    nextPage:
      data.meta.pagination.current_page + 1 > data.meta.pagination.total_pages
        ? null
        : data.meta.pagination.current_page + 1
  }
}

export const fetchProduct = async (
  productId: number
): Promise<OperationResult<MetaData<Product>>> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${productId}`,
    {
      credentials: 'include'
    }
  )

  if (res.status === 404) {
    throw new Error('Product not found')
  }

  return res.json()
}

export const fetchBrand = async (
  brandId: number
): Promise<OperationResult<Brand>> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/brands/${brandId}`, {
    credentials: 'include'
  })

  if (res.status === 404) {
    throw new Error('Brand not found')
  }

  return res.json()
}

export const fetchProductImages = async (
  productId: number
): Promise<OperationResult<MetaData<Image[]>>> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${productId}/images`,
    {
      credentials: 'include'
    }
  )

  if (res.status === 204) {
    return {
      success: true,
      message: 'No images found',
      statusCode: 204
    }
  }

  if (res.status === 404) {
    throw new Error('Product not found')
  }

  return res.json()
}

export const createProduct = async (
  product: Product
): Promise<OperationResult<MetaData<Product>>> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/products/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })

  const data: OperationResult<MetaData<Product>> = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}

export const deleteProduct = async (
  productId: number
): Promise<OperationResult<boolean>> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${productId}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  )

  if (!res.ok) {
    throw new Error('Something went wrong deleting the product')
  }

  return await res.json()
}

export const updateProduct = async ({
  productId,
  product
}: {
  productId: number
  product: Product
}): Promise<OperationResult<MetaData<Product>>> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${productId}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    }
  )

  const data: OperationResult<MetaData<Product>> = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}

export const loginUser = async ({
  username,
  password
}: {
  username: string
  password: string
}): Promise<string> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  if (!res.ok) {
    throw new Error('Invalid credentials')
  }

  return await res.json()
}

export const addImageToProduct = async ({
  productId,
  picture
}: { productId: number; picture: File }): Promise<
  OperationResult<MetaData<Image>>
> => {
  const formData = new FormData()
  formData.append('image', picture)

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/products/${productId}/images`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData
    }
  )

  const data: OperationResult<MetaData<Image>> = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}
