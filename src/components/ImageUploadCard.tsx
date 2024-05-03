import { Card } from '@tremor/react'

const ImageUploadCard = ({
  picturePreview,
  inputRef,
  uploadText
}: {
  picturePreview: string
  inputRef: React.RefObject<HTMLInputElement>
  uploadText?: string
}) => {
  const uploadTextToShow =
    uploadText || '(Optional) Add an image to your product'

  return (
    <Card>
      <div className='flex justify-between items-center'>
        <label
          htmlFor='file'
          onClick={() => inputRef.current?.click()}
          className='cursor-pointer'
        >
          {picturePreview === '' ? (
            <span className='text-sm text-gray-400 w-32 h-32 rounded-md flex items-center justify-center'>
              Upload image
            </span>
          ) : (
            <img
              src={picturePreview}
              alt='Preview'
              width={128}
              height={128}
              className='rounded-md object-cover w-32 h-32'
            />
          )}
        </label>
        {picturePreview === '' ? (
          <span className='text-sm text-gray-400 w-28 text-center'>
            {uploadTextToShow}
          </span>
        ) : (
          <span className='text-sm text-gray-400'>Looks good!</span>
        )}
      </div>
    </Card>
  )
}

export { ImageUploadCard }
