
import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appearanceCollection = collection(db, 'appearance');

  if (req.method === 'GET') {
    try {
      const appearanceSnapshot = await getDocs(appearanceCollection);
      const appearanceData = appearanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(appearanceData[0] || null);
    } catch (error) {
      console.error('Erro ao buscar configurações de aparência:', error);
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  } else if (req.method === 'POST') {
    try {
      const { primaryColor, heroImage } = req.body;

      const appearanceData = {
        primaryColor,
        heroImage,
        updatedAt: serverTimestamp()
      };

      const appearanceSnapshot = await getDocs(appearanceCollection);
      
      if (appearanceSnapshot.empty) {
        // Criar novo documento
        const docRef = await addDoc(appearanceCollection, {
          ...appearanceData,
          createdAt: serverTimestamp()
        });
        res.status(201).json({ id: docRef.id, ...appearanceData });
      } else {
        // Atualizar documento existente
        const docRef = appearanceSnapshot.docs[0].ref;
        await setDoc(docRef, appearanceData, { merge: true });
        res.status(200).json({ id: docRef.id, ...appearanceData });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de aparência:', error);
      res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
