
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const auth = getAuth();

export interface OwnerData {
  email: string;
  name: string;
  setupComplete: boolean;
  createdAt: Date;
}

// Verificar se já existe um proprietário configurado
export const checkOwnerExists = async (): Promise<boolean> => {
  try {
    const docRef = doc(db, 'owner_config', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() && docSnap.data()?.setupComplete === true;
  } catch (error) {
    console.error('Erro ao verificar proprietário:', error);
    return false;
  }
};

// Configuração inicial do proprietário
export const setupOwner = async (email: string, password: string, name: string) => {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Salvar dados do proprietário no Firestore
    const ownerData: OwnerData = {
      email,
      name,
      setupComplete: true,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'owner_config', 'main'), ownerData);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...ownerData,
      role: 'owner'
    });
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Erro na configuração inicial:', error);
    return { success: false, error: error.message };
  }
};

// Login do proprietário
export const signInOwner = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verificar se é o proprietário
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists() || userDoc.data()?.role !== 'owner') {
      throw new Error('Acesso não autorizado');
    }
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { success: false, error: error.message };
  }
};

// Recuperação de senha
export const resetOwnerPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Erro na recuperação de senha:', error);
    return { success: false, error: error.message };
  }
};

// Logout
export const signOutOwner = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error: any) {
    console.error('Erro no logout:', error);
    return { success: false, error: error.message };
  }
};

// Observador de estado de autenticação
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Obter dados do proprietário
export const getOwnerData = async (): Promise<OwnerData | null> => {
  try {
    const docRef = doc(db, 'owner_config', 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as OwnerData : null;
  } catch (error) {
    console.error('Erro ao buscar dados do proprietário:', error);
    return null;
  }
};
