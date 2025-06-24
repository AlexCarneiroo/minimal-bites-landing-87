import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

interface ReservationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ReservationForm = ({ onClose, onSuccess }: ReservationFormProps) => {
  const { customerData, isLoggedIn } = useCustomerAuth();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: "Nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
      message: "Por favor, insira um email válido.",
    }),
    phone: z.string().min(10, {
      message: "Número de telefone deve ter pelo menos 10 dígitos.",
    }),
    date: z.string().min(1, {
      message: "Por favor, selecione uma data.",
    }),
    time: z.string().min(1, {
      message: "Por favor, selecione um horário.",
    }),
    guests: z.number().min(1, {
      message: "Deve haver pelo menos 1 convidado.",
    }),
    message: z.string().optional(),
  })

  type FormData = z.infer<typeof FormSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: isLoggedIn && customerData ? customerData.name : "",
      email: isLoggedIn && customerData ? customerData.email : "",
      phone: isLoggedIn && customerData ? customerData.phone : "",
      date: "",
      time: "",
      guests: 1,
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, 'reservations'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      toast({
        title: "Reserva enviada!",
        description: "Entraremos em contato em breve para confirmar sua reserva.",
      })
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oh não! Algo deu errado.",
        description: "Houve um problema ao enviar sua reserva. Por favor, tente novamente.",
      })
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faça sua reserva</DialogTitle>
          <DialogDescription>
            Por favor, preencha todos os campos para solicitar uma reserva.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      {...field} 
                      readOnly={isLoggedIn}
                      className={isLoggedIn ? "bg-gray-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      {...field} 
                      readOnly={isLoggedIn}
                      className={isLoggedIn ? "bg-gray-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(11) 99999-9999" 
                      {...field} 
                      readOnly={isLoggedIn}
                      className={isLoggedIn ? "bg-gray-50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between space-x-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3.5 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            setDate(date)
                            field.onChange(date?.toLocaleDateString())
                          }}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="Escolha um horário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de convidados</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Alguma observação?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enviar reserva</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
