import axios from '../utils/axios'

type RemoveBackgroundResponse = {
  data: Blob,
  status: number
}

export const removeBackground = async (formData: FormData): Promise<RemoveBackgroundResponse> => {
  try {
    const { data, status } = await axios.post('/remove-background/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    })

    return {
      data,
      status
    }
  } catch (error) {
    console.error('Ошибка при удалении фона:', error);
    throw error;
  }
}