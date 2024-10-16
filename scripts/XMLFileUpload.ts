import { FetchRequest } from "./FetchTools";

export const uploadFile = async (file: File, url: string, onProgress: (progress: number) => void): Promise<Uint8Array> => {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total);
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

    xhr.open('PUT', url);
    // if (FetchRequest._csrf){
    //   xhr.setRequestHeader('X-XSRF-TOKEN', FetchRequest._csrf);
    // }
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    file.arrayBuffer().then(a => {
      xhr.send(a); // Send the form data
    })
  });
}

export const uploadAndDecode = async <T>(file: File, url: string, onProgress: (progress: number) => void, decoder: (_b: Uint8Array) => T): Promise<T> => {
  const result = await uploadFile(file, url, onProgress);
  return decoder(result);
}