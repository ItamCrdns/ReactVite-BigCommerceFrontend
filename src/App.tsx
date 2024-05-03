import { Route, Switch } from 'wouter'
import AllProducts from './components/AllProducts'
import Product from './components/Product'
import HomePage from './components/HomePage'
import { Tabs } from './components/Tabs/Tabs'
import { tabOptions } from './components/Tabs/tabsOptions'
import CreateProduct from './components/CreateProduct'
import Brand from './components/Brand'
import Login from './components/Login'

function App() {
  return (
    <main className='flex flex-col justify-center items-center'>
      <h1 className='font-bold text-3xl p-8'>My Beach Store</h1>
      <Tabs options={tabOptions} />
      <Switch>
        <Route path='/' component={HomePage} />
        <Route path='/products' component={AllProducts} />
        <Route path='/products/create' component={CreateProduct} />
        <Route path='/products/:id' component={Product} />
        <Route path='/brands/:id' component={Brand} />
        <Route path='/login' component={Login} />

        <Route>
          <h1 className=''>Not found!</h1>
        </Route>
      </Switch>
    </main>
  )
}

export default App
