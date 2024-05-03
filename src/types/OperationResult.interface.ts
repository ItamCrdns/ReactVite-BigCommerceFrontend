export interface OperationResult<T> {
  success: boolean
  message: string
  statusCode: number
  data?: T
  errors?: IError
}

interface IError {
  status: number
  instance: string
  title: string
  type: string
  errors: object[]
}
