import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageToStorage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const uniqueId = crypto.randomUUID(); // Gera um ID único nativo
  const fileRef = ref(storage, `about/${uniqueId}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
