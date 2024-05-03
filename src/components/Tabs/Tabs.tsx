import { Tab, TabGroup, TabList } from '@tremor/react'
import type { Tab as ITab } from '../../types/Tab.interface'
import { Link, useLocation } from 'wouter'

const Tabs: React.FC<{ options: ITab[] }> = (props) => {
  const { options } = props

  const [location] = useLocation()

  const parts = location.split('/')
  const lastPart = parts[parts.length - 1]

  const currentIndex = options.findIndex((option) => {
    return option.where === lastPart
  })

  const defaultIndex = currentIndex === -1 ? 0 : currentIndex

  return (
    <TabGroup
      className='flex items-center justify-center pb-8'
      index={defaultIndex}
    >
      <TabList variant='solid'>
        {options.map((option) => {
          return (
            <Tab key={option.index} value={option.index}>
              <Link href={option.path}>{option.name}</Link>
            </Tab>
          )
        })}
      </TabList>
    </TabGroup>
  )
}

export { Tabs }
