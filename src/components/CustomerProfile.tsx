
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
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Meu Perfil</span>
            <div className="flex gap-3">
              {isAdmin && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAdminAccess}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Painel Admin
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-8">
          {/* Informações do Cliente */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">Nome:</span>
                    <span className="text-gray-900 text-lg">{customerData.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">Email:</span>
                    <span className="text-gray-900 text-lg">{customerData.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Phone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">Telefone:</span>
                    <span className="text-gray-900 text-lg">{customerData.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                Minhas Reservas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
                  <p className="text-gray-600 text-lg">Carregando reservas...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-2">Nenhuma reserva encontrada</p>
                  <p className="text-gray-500">Você ainda não possui reservas</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id} className="border-l-4 border-l-primary bg-white shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 block">Data da Reserva</span>
                                <span className="text-gray-900 text-lg">{reservation.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-full">
                                <Clock className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 block">Horário</span>
                                <span className="text-gray-900 text-lg">{reservation.time}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-full">
                                <Users className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 block">Número de Pessoas</span>
                                <span className="text-gray-900 text-lg">
                                  {reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(reservation.status)} px-4 py-2 text-sm font-semibold`}>
                            {getStatusLabel(reservation.status)}
                          </Badge>
                        </div>
                        
                        {reservation.message && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                            <p className="text-sm font-semibold text-blue-800 mb-1">Observações:</p>
                            <p className="text-blue-700">{reservation.message}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Reserva criada em: {formatDate(reservation.createdAt)}
                          </p>
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
