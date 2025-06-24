import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

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

// Feedbacks
export const saveFeedback = async (data: any) => {
  try {
    const feedbacksRef = collection(db, 'feedbacks');
    const docRef = await addDoc(feedbacksRef, {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    return null;
  }
};

export const getFeedbacks = async () => {
  try {
    const feedbacksRef = collection(db, 'feedbacks');
    const snapshot = await getDocs(feedbacksRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    return [];
  }
};

export const deleteFeedback = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'feedbacks', id));
    return true;
  } catch (error) {
    console.error('Erro ao deletar feedback:', error);
    return false;
  }
};

// Ofertas Especiais
export const saveSpecialOffer = async (data: any) => {
  try {
    const offersRef = collection(db, 'special_offers');
    const docRef = await addDoc(offersRef, {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar oferta especial:', error);
    return null;
  }
};

export const getSpecialOffers = async () => {
  try {
    const offersRef = collection(db, 'special_offers');
    const snapshot = await getDocs(offersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ofertas especiais:', error);
    return [];
  }
};

export const deleteSpecialOffer = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'special_offers', id));
    return true;
  } catch (error) {
    console.error('Erro ao deletar oferta especial:', error);
    return false;
  }
};

// Reservas
export const saveReservation = async (data: any) => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const docRef = await addDoc(reservationsRef, {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar reserva:', error);
    return null;
  }
};

export const getReservations = async () => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const snapshot = await getDocs(reservationsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return [];
  }
};

export const deleteReservation = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'reservations', id));
    return true;
  } catch (error) {
    console.error('Erro ao deletar reserva:', error);
    return false;
  }
};

// Produtos (usado pelo SpecialOfferEditor)
export const saveProduct = async (data: any) => {
  try {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    return null;
  }
};

export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return true;
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return false;
  }
};

// Funções para gerenciar admins
export const setUserAsAdmin = async (userId: string, isAdmin: boolean) => {
  try {
    const docRef = doc(db, 'customers', userId);
    await setDoc(docRef, {
      isAdmin: isAdmin ? 1 : 0,
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao definir usuário como admin:', error);
    return false;
  }
};

export const getUserAdminStatus = async (userId: string) => {
  try {
    const docRef = doc(db, 'customers', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.isAdmin === 1;
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar status de admin:', error);
    return false;
  }
};
