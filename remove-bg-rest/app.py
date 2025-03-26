from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
import io
from typing import List

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем доступ с любых доменов
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем любые HTTP методы
    allow_headers=["*"],  # Разрешаем любые заголовки
)


@app.get("/")
async def index():
    return "Welcome to Remove Background API"


@app.post("/remove-background/")
async def remove_background(files: List[UploadFile] = File(...)):
    # Список для хранения обработанных изображений
    processed_images = []

    for uploaded_file in files:
        # Чтение данных изображения
        img_bytes = await uploaded_file.read()

        # Удаление фона с изображения
        result = remove(img_bytes)

        # Преобразуем результат в поток байтов
        img_stream = io.BytesIO(result)
        img_stream.seek(0)  # Возвращаемся в начало потока

        processed_images.append((uploaded_file.filename, img_stream))

    # Если одно изображение, отправляем его
    if len(processed_images) == 1:
        filename, img_stream = processed_images[0]
        return StreamingResponse(img_stream, media_type="image/png",
                                 headers={"Content-Disposition": f"attachment; filename={filename}_nobg.png"})

    # Если несколько изображений, вернем архив
    if len(processed_images) > 1:
        # Для нескольких изображений можно добавить архивирование (например, через zip)
        import zipfile

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for filename, img_stream in processed_images:
                img_stream.seek(0)
                zip_file.writestr(f"{filename}_nobg.png", img_stream.read())

        zip_buffer.seek(0)
        return StreamingResponse(zip_buffer, media_type="application/zip",
                                 headers={"Content-Disposition": "attachment; filename=background_removed_images.zip"})


# Запуск приложения
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
