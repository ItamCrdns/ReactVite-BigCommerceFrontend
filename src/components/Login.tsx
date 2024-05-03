import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogPanel,
  TextInput
} from '@tremor/react'
import { useMutation } from 'react-query'
import { loginUser } from '../api'
import { saveCookie } from '../util/saveCookie'
import { useState } from 'react'
import { Link } from 'wouter'

const Login = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { isLoading, isError, error, mutate } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
    onSuccess: (res) => {
      saveCookie('JwtToken', res) // Save the JWT token in a cookie, which then can be used to authenticate requests
      setIsOpen(true)
    }
  })

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const username = event.currentTarget.elements.namedItem(
      'username'
    ) as HTMLInputElement
    const password = event.currentTarget.elements.namedItem(
      'password'
    ) as HTMLInputElement
    mutate({ username: username.value, password: password.value })
  }

  return (
    <div className='flex items-center justify-center mt-8'>
      <Card className='flex flex-col justify-center gap-8 p-8 rounded-md shadow-md'>
        <div>
          <h1 className='text-lg font-semibold'>Sign in to your account</h1>
        </div>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <p className='text-sm font-semibold mb-2'>Username</p>
            <TextInput
              name='username'
              type='text'
              placeholder='Username'
              autoFocus
              required
            />
          </div>
          <div>
            <p className='text-sm font-semibold mb-2'>Password</p>
            <TextInput
              name='password'
              type='password'
              placeholder='Password'
              required
            />
          </div>
          <div className='flex self-center justify-center text-center'>
            <Button type='submit'>Login</Button>
          </div>
        </form>
        {isLoading && (
          <div className='flex items-start justify-center'>
            <Badge color='blue' className='text-center'>
              Loading...
            </Badge>
          </div>
        )}
        {isError && (
          <div className='flex items-start justify-center'>
            <Badge color='red' className='text-center'>
              {(error as Error).message}
            </Badge>
          </div>
        )}
      </Card>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        static={true}
      >
        <DialogPanel className='space-y-4'>
          <h1 className='text-lg font-semibold text-center'>
            Login successful!
          </h1>
          <p className='text-center'>
            You have successfully logged in to your account
          </p>
          <div className='flex self-center justify-center text-center'>
            <Button
              onClick={() => {
                setIsOpen(false)
              }}
            >
              <Link href='/products'>Continue to products</Link>
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  )
}

export default Login
