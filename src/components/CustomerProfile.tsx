
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getCustomerReservations, signOutCustomer, CustomerReservation } from '@/lib/firebase-customer-auth';
import { Calendar, Clock, Users, Phone, Mail, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface CustomerProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomerProfile = ({ isOpen, onClose }: CustomerProfileProps) => {
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const { customerData, user, isLoggedIn } = useCustomerAuth();
  const { isAdmin } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && customerData?.email) {
      fetchReservations();
    }
  }, [isLoggedIn, customerData]);

  const fetchReservations = async () => {
    if (!customerData?.email) return;
    
    setLoading(true);
    try {
      const userReservations = await getCustomerReservations(customerData.email);
      setReservations(userReservations);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas reservas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await signOutCustomer();
      if (result.success) {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const handleAdminAccess = () => {
    navigate('/admin');
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  };

  const formatDate = (timestamp: any): string => {
    try {
      if (timestamp?.toDate) {
        return format(timestamp.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: pt });
      }
      return 'Data não disponível';
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (!isLoggedIn || !customerData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Meu Perfil</span>
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAdminAccess}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Painel Admin
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Nome:</span>
                <span>{customerData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span>{customerData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Telefone:</span>
                <span>{customerData.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Minhas Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando reservas...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Você ainda não possui reservas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {reservation.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{reservation.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>
                                {reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(reservation.status)}>
                            {getStatusLabel(reservation.status)}
                          </Badge>
                        </div>
                        
                        {reservation.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Observações:</strong> {reservation.message}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-3 text-xs text-gray-500">
                          Reserva criada em: {formatDate(reservation.createdAt)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerProfile;
