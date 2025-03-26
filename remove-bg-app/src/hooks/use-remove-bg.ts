import { useState } from 'react'
import axios from 'axios'
import { removeBackground } from '../api/remove-bg'

export const useRemoveBackground = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processImage = async (image: File) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('files', image)

      const { data, status } = await removeBackground(formData)

      if (status !== 200) {
        throw new Error(`Ошибка ${status}`)
      }

      const url = URL.createObjectURL(data)
      setUploadedImage(url)

      return () => URL.revokeObjectURL(url)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError('Ошибка при загрузке изображения')
      } else {
        setError('Неизвестная ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  return { uploadedImage, loading, error, processImage }
}
