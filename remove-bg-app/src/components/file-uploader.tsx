import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRemoveBackground } from '../hooks/use-remove-bg'

const FileUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null)
  const { uploadedImage, loading, error, processImage } = useRemoveBackground()

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    },
  })

  const handleUpload = () => {
    if (image) processImage(image);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #007bff',
          padding: '20px',
          borderRadius: '5px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <p>Перетащите изображение сюда или выберите файл</p>
      </div>

      {image && !loading && (
        <div className='mt-[20px] flex gap-x-2'>
          <p className='p-2 border-1 rounded-xl bg-blue-100'>{image.name}</p>
          <button className='hover:underline cursor-pointer' onClick={handleUpload}>Удалить фон</button>
        </div>
      )}

      {loading && <p>Загрузка...</p>}

      {uploadedImage && (
        <div className='flex flex-col items-center border-1 p-5 rounded-xl bg-blue-100 mt-[20px]'>
          <h3>Результат:</h3>
          <img src={uploadedImage} alt="Processed" className='w-[300px]' />
          <a href={uploadedImage} download className='text-blue-500 hover:underline cursor-pointer'>Скачать</a>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
