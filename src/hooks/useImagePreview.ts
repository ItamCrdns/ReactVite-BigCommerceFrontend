import { useRef, useState } from 'react'

export const useImagePreview = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<File | null>(null)
  const [picturePreview, setPicturePreview] = useState<string>('')

  const updateImageToUpload = (image: File) => {
    setImage(image)
    setPicturePreview(URL.createObjectURL(image))
  }

  return {
    image,
    picturePreview,
    inputRef,
    updateImageToUpload
  }
}
