
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReservationForm from "./ReservationForm";
import { useState } from "react";

interface ReservationDialogProps {
  children: React.ReactNode;
}

const ReservationDialog = ({ children }: ReservationDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Reserva de Mesa</DialogTitle>
          <DialogDescription className="text-center">
            Preencha o formulário abaixo para fazer sua reserva em nosso restaurante.
          </DialogDescription>
        </DialogHeader>
        <ReservationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
