
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

// Configurações Gerais
export const saveGeneralSettings = async (data: any) => {
  try {
    const docRef = doc(db, 'general_settings', 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações gerais:', error);
    return false;
  }
};

export const getGeneralSettings = async () => {
  try {
    const docRef = doc(db, 'general_settings', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Erro ao buscar configurações gerais:', error);
    return null;
  }
};

// Configurações de Aparência
export const saveAppearanceSettings = async (data: any) => {
  try {
    const docRef = doc(db, 'appearance', 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações de aparência:', error);
    return false;
  }
};

export const getAppearanceSettings = async () => {
  try {
    const docRef = doc(db, 'appearance', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Erro ao buscar configurações de aparência:', error);
    return null;
  }
};

// Configurações Sobre
export const saveAboutSettings = async (data: any) => {
  try {
    const docRef = doc(db, 'about', 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações sobre:', error);
    return false;
  }
};

export const getAboutSettings = async () => {
  try {
    const docRef = doc(db, 'about', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Erro ao buscar configurações sobre:', error);
    return null;
  }
};

// Configurações Footer
export const saveFooterSettings = async (data: any) => {
  try {
    const docRef = doc(db, 'footer', 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações do footer:', error);
    return false;
  }
};

export const getFooterSettings = async () => {
  try {
    const docRef = doc(db, 'footer', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Erro ao buscar configurações do footer:', error);
    return null;
  }
};
