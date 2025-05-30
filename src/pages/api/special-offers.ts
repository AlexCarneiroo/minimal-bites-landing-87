import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const offersCollection = collection(db, 'special_offers');

  if (req.method === 'GET') {
    try {
      const offersSnapshot = await getDocs(offersCollection);
      const offersData = offersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(offersData);
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
      res.status(500).json({ error: 'Erro ao buscar ofertas' });
    }
  } else if (req.method === 'POST') {
    try {
      const { id, name, description, regularPrice, promoPrice, discount, label, image } = req.body;

      if (!name || !description || !regularPrice) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const offerData = {
        name,
        description,
        regularPrice,
        promoPrice,
        discount,
        label,
        image,
        updatedAt: serverTimestamp()
      };

      if (id) {
        // Atualizar oferta existente
        const offerDoc = doc(db, 'special_offers', id);
        await setDoc(offerDoc, offerData, { merge: true });
        res.status(200).json({ id, ...offerData });
      } else {
        // Criar nova oferta
        const docRef = await addDoc(offersCollection, {
          ...offerData,
          createdAt: serverTimestamp()
        });
        res.status(201).json({ id: docRef.id, ...offerData });
      }
    } catch (error) {
      console.error('Erro ao salvar oferta:', error);
      res.status(500).json({ error: 'Erro ao salvar oferta' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' });
      }

      const offerDoc = doc(db, 'special_offers', id as string);
      await deleteDoc(offerDoc);
      
      res.status(200).json({ id });
    } catch (error) {
      console.error('Erro ao excluir oferta:', error);
      res.status(500).json({ error: 'Erro ao excluir oferta' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 