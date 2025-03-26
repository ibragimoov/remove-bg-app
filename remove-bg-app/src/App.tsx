import FileUpload from "./components/file-uploader"

function App() {
  return (
    <div className="p-5 flex flex-col items-center gap-y-3">
      <h1 className='text-lg font-bold'>Remove Background App</h1>
      <p>Загрузите фотографии, у которых хотите убрать задний фон</p>

      <FileUpload />
    </div>
  )
}

export default App
