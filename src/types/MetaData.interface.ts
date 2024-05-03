import type { Pagination } from './Pagination.interface'

export interface MetaData<T> {
  data: T
  meta: Meta
}

interface Meta {
  pagination: Pagination
}
