// src/lib/storage.ts
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

/**
 * Faz o upload de um arquivo para o Firebase Storage
 * e devolve a URL pública de download.
 *
 * @param file Arquivo (input type="file")
 * @param path Caminho dentro do bucket (ex: "previews/123/poster.jpg")
 */
export async function uploadMediaFile(
  file: File,
  path: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const percent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(percent));
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}
