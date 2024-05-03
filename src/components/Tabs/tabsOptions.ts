import type { Tab } from '../../types/Tab.interface'

export const tabOptions: Tab[] = [
  {
    index: 0,
    name: 'Home',
    path: '/',
    where: ''
  },
  {
    index: 1,
    name: 'Products',
    path: '/products',
    where: 'products'
  },
  {
    index: 2,
    name: 'Create product',
    path: '/products/create',
    where: 'create'
  }
]
