import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reservationsCollection = collection(db, 'reservations');

  if (req.method === 'GET') {
    try {
      const q = query(reservationsCollection, orderBy('createdAt', 'desc'));
      const reservationsSnapshot = await getDocs(q);
      const reservationsData = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      res.status(200).json(reservationsData);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, phone, date, time, guests, message } = req.body;

      if (!name || !email || !phone || !date || !time || !guests) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const reservationData = {
        name,
        email,
        phone,
        date,
        time,
        guests,
        message,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(reservationsCollection, reservationData);
      res.status(201).json({ id: docRef.id, ...reservationData });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({ error: 'Erro ao criar reserva' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'ID e status são obrigatórios' });
      }

      const reservationDoc = doc(db, 'reservations', id);
      await setDoc(reservationDoc, { status }, { merge: true });
      
      res.status(200).json({ id, status });
    } catch (error) {
      console.error('Erro ao atualizar status da reserva:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' });
      }

      const reservationDoc = doc(db, 'reservations', id as string);
      await deleteDoc(reservationDoc);
      
      res.status(200).json({ id });
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      res.status(500).json({ error: 'Erro ao excluir reserva' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 