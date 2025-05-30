import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const footerCollection = collection(db, 'footer');

  if (req.method === 'GET') {
    try {
      const footerSnapshot = await getDocs(footerCollection);
      const footerData = footerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(footerData[0] || null);
    } catch (error) {
      console.error('Erro ao buscar conteúdo do rodapé:', error);
      res.status(500).json({ error: 'Erro ao buscar conteúdo' });
    }
  } else if (req.method === 'POST') {
    try {
      const { logo, description, address, phone, email, socialMedia, copyright } = req.body;

      if (!description || !address || !phone || !email || !copyright) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const footerData = {
        logo,
        description,
        address,
        phone,
        email,
        socialMedia,
        copyright,
        updatedAt: serverTimestamp()
      };

      const footerSnapshot = await getDocs(footerCollection);
      
      if (footerSnapshot.empty) {
        // Criar novo documento
        const docRef = await addDoc(footerCollection, {
          ...footerData,
          createdAt: serverTimestamp()
        });
        res.status(201).json({ id: docRef.id, ...footerData });
      } else {
        // Atualizar documento existente
        const docRef = footerSnapshot.docs[0].ref;
        await setDoc(docRef, footerData, { merge: true });
        res.status(200).json({ id: docRef.id, ...footerData });
      }
    } catch (error) {
      console.error('Erro ao salvar conteúdo do rodapé:', error);
      res.status(500).json({ error: 'Erro ao salvar conteúdo' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 