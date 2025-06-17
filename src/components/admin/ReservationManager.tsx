import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function ReservationManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const formatDate = (timestamp: any): string => {
    try {
      if (timestamp instanceof Timestamp) {
        return format(timestamp.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: pt });
      }
      if (timestamp instanceof Date) {
        return format(timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
      }
      return 'Data não disponível';
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      let q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => {
        const d = doc.data();

        // Garantir que todos os campos sejam strings ou números
        const reservation: Reservation = {
          id: doc.id,
          name: String(d.name || ''),
          email: String(d.email || ''),
          phone: String(d.phone || ''),
          date: String(d.date || ''),
          time: String(d.time || ''),
          guests: Number(d.guests || 0),
          message: d.message ? String(d.message) : undefined,
          status: (d.status || 'pending') as Reservation['status'],
          createdAt: formatDate(d.createdAt)
        };

        return reservation;
      });
      setReservations(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar as reservas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Reservation['status']) => {
    try {
      await setDoc(doc(db, 'reservations', id), { 
        status: newStatus,
        updatedAt: Timestamp.now()
      }, { merge: true });
      
      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
      );
      
      toast({
        title: "Status atualizado",
        description: "O status da reserva foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) return;
    try {
      await deleteDoc(doc(db, 'reservations', id));
      setReservations(prev => prev.filter(res => res.id !== id));
      toast({
        title: "Reserva excluída",
        description: "A reserva foi excluída com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir reserva:", error);
      toast({
        title: "Erro ao excluir",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const getStatusStyle = (status: Reservation['status']) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status];
  };

  const getStatusLabel = (status: Reservation['status']) => {
    return {
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      pending: 'Pendente'
    }[status];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Gerenciar Reservas</h3>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
              >
                Pendentes
              </Button>
              <Button
                variant={filter === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setFilter('confirmed')}
              >
                Confirmadas
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setFilter('cancelled')}
              >
                Canceladas
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Carregando reservas...</div>
          ) : reservations.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma reserva encontrada</p>
          ) : (
            <div className="space-y-4">
              {reservations.map(reservation => (
                <Card key={reservation.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{reservation.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(reservation.status)}`}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{reservation.email}</p>
                      <p className="text-sm text-gray-600">{reservation.phone}</p>
                      <p className="text-sm text-gray-600">
                        Data: {reservation.date} às {reservation.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        {reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}
                      </p>
                      {reservation.message && (
                        <p className="text-sm text-gray-600">{reservation.message}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Criada em: {reservation.createdAt}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(reservation.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
