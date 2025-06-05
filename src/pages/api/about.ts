
import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const aboutCollection = collection(db, 'about');

  if (req.method === 'GET') {
    try {
      const aboutSnapshot = await getDocs(aboutCollection);
      const aboutData = aboutSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(aboutData[0] || null);
    } catch (error) {
      console.error('Erro ao buscar conteúdo sobre:', error);
      res.status(500).json({ error: 'Erro ao buscar conteúdo' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, images } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
      }

      const aboutData = {
        title,
        description,
        images: images || [],
        updatedAt: serverTimestamp()
      };

      const aboutSnapshot = await getDocs(aboutCollection);
      
      if (aboutSnapshot.empty) {
        // Criar novo documento
        const docRef = await addDoc(aboutCollection, {
          ...aboutData,
          createdAt: serverTimestamp()
        });
        res.status(201).json({ id: docRef.id, ...aboutData });
      } else {
        // Atualizar documento existente
        const docRef = aboutSnapshot.docs[0].ref;
        await setDoc(docRef, aboutData, { merge: true });
        res.status(200).json({ id: docRef.id, ...aboutData });
      }
    } catch (error) {
      console.error('Erro ao salvar conteúdo sobre:', error);
      res.status(500).json({ error: 'Erro ao salvar conteúdo' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
