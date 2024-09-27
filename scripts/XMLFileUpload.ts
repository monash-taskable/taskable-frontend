import { FetchRequest } from "./FetchTools";

export const uploadFile = async (file: File, url: string, onProgress: (progress: number) => void): Promise<Uint8Array> => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total));
        onProgress(percentComplete); // Call the callback with the percentage
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const arrayBuffer = xhr.response; // The binary data as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer); // Convert to Uint8Array
        resolve(uint8Array);   // Resolve if the request was successful
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Upload failed due to network error.'));
    };

    xhr.open('POST', url);
    if (FetchRequest._csrf){
      xhr.setRequestHeader('X-XSRF-TOKEN', FetchRequest._csrf);
    }
    xhr.send(formData); // Send the form data
  });
}

export const uploadAndDecode = async <T>(file: File, url: string, onProgress: (progress: number) => void, decoder: (_b: Uint8Array) => T): Promise<T> => {
  const result = await uploadFile(file, url, onProgress);
  return decoder(result);
}