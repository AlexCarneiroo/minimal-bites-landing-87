import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const auth = getAuth();

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  isAdmin?: number; // 1 for admin, 0 for regular user
}

export interface CustomerReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

// Registrar novo cliente
export const registerCustomer = async (
  email: string, 
  password: string, 
  name: string, 
  phone: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salvar dados do cliente no Firestore com isAdmin padrão como 0
    await setDoc(doc(db, 'customers', user.uid), {
      name,
      email,
      phone,
      isAdmin: 0, // Usuário comum por padrão
      createdAt: serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    console.error('Erro no registro do cliente:', error);
    return { 
      success: false, 
      error: getErrorMessage(error.code) 
    };
  }
};

// Login do cliente
export const signInCustomer = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { success: false, error: error.message };
  }
};

// Logout do cliente
export const signOutCustomer = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Erro no logout:', error);
    return { success: false, error: error.message };
  }
};

// Recuperação de senha
export const resetCustomerPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Erro na recuperação de senha:', error);
    return { success: false, error: error.message };
  }
};

// Obter dados do cliente
export const getCustomerData = async (uid: string): Promise<CustomerData | null> => {
  try {
    const docRef = doc(db, 'customers', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as CustomerData : null;
  } catch (error) {
    console.error('Erro ao buscar dados do cliente:', error);
    return null;
  }
};

// Buscar reservas do cliente
export const getCustomerReservations = async (email: string): Promise<CustomerReservation[]> => {
  try {
    const q = query(
      collection(db, 'reservations'),
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CustomerReservation[];
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return [];
  }
};

// Observador de estado de autenticação
export const onCustomerAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
