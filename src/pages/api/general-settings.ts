
import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const settingsCollection = collection(db, 'general_settings');

  if (req.method === 'GET') {
    try {
      const settingsSnapshot = await getDocs(settingsCollection);
      const settingsData = settingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(settingsData[0] || null);
    } catch (error) {
      console.error('Erro ao buscar configurações gerais:', error);
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  } else if (req.method === 'POST') {
    try {
      const settingsData = {
        ...req.body,
        updatedAt: serverTimestamp()
      };

      const settingsSnapshot = await getDocs(settingsCollection);
      
      if (settingsSnapshot.empty) {
        // Criar novo documento
        const docRef = await addDoc(settingsCollection, {
          ...settingsData,
          createdAt: serverTimestamp()
        });
        res.status(201).json({ id: docRef.id, ...settingsData });
      } else {
        // Atualizar documento existente
        const docRef = settingsSnapshot.docs[0].ref;
        await setDoc(docRef, settingsData, { merge: true });
        res.status(200).json({ id: docRef.id, ...settingsData });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações gerais:', error);
      res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
