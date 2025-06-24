
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
      {open && (
        <ReservationForm 
          onClose={() => setOpen(false)} 
          onSuccess={() => setOpen(false)} 
        />
      )}
    </Dialog>
  );
};

export default ReservationDialog;
