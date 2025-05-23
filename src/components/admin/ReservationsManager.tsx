
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  people: number;
  phone: string;
  status: string;
}

interface ReservationsManagerProps {
  reservations: Reservation[];
}

const ReservationsManager = ({ reservations }: ReservationsManagerProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableCaption>Lista de reservas recentes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Pessoas</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.id}</TableCell>
                  <TableCell>{reservation.name}</TableCell>
                  <TableCell>{reservation.date}</TableCell>
                  <TableCell>{reservation.time}</TableCell>
                  <TableCell>{reservation.people}</TableCell>
                  <TableCell>{reservation.phone}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      reservation.status === 'Confirmada' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Confirmar</Button>
                      <Button variant="outline" size="sm" className="text-red-500">Cancelar</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsManager;
