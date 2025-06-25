
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from 'date-fns';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

interface ReservationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ReservationForm = ({ onClose, onSuccess }: ReservationFormProps) => {
  const { customerData, isLoggedIn } = useCustomerAuth();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
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

  // Helper function to safely format date
  const formatDate = (dateValue: string) => {
    if (!dateValue) return null;
    
    try {
      // Try to parse the date string
      const parsedDate = parseISO(dateValue);
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd/MM/yyyy");
      }
      
      // If parseISO fails, try with Date constructor
      const date = new Date(dateValue);
      if (isValid(date)) {
        return format(date, "dd/MM/yyyy");
      }
      
      return null;
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[500px] h-[90vh] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4 border-b">
          <DialogTitle className="text-xl sm:text-2xl text-center">Reserva de Mesa</DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            Preencha o formulário abaixo para fazer sua reserva em nosso restaurante.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Nome completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
                        {...field} 
                        readOnly={isLoggedIn}
                        className={cn(
                          "text-sm sm:text-base",
                          isLoggedIn ? "bg-gray-50 cursor-not-allowed" : ""
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                    {isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1">
                        Campo preenchido automaticamente
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        {...field} 
                        readOnly={isLoggedIn}
                        className={cn(
                          "text-sm sm:text-base",
                          isLoggedIn ? "bg-gray-50 cursor-not-allowed" : ""
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                    {isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1">
                        Campo preenchido automaticamente
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(11) 99999-9999" 
                        {...field} 
                        readOnly={isLoggedIn}
                        className={cn(
                          "text-sm sm:text-base",
                          isLoggedIn ? "bg-gray-50 cursor-not-allowed" : ""
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                    {isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1">
                        Campo preenchido automaticamente
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:space-x-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm sm:text-base">Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal text-sm sm:text-base h-9 sm:h-10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value) || "Data inválida"
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
                            onSelect={(selectedDate) => {
                              setDate(selectedDate)
                              if (selectedDate) {
                                field.onChange(selectedDate.toISOString())
                              } else {
                                field.onChange("")
                              }
                            }}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm sm:text-base">Horário</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          placeholder="Escolha um horário" 
                          {...field} 
                          className="text-sm sm:text-base h-9 sm:h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Número de convidados</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        className="text-sm sm:text-base h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Mensagem (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Alguma observação?" 
                        {...field} 
                        className="text-sm sm:text-base h-9 sm:h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full text-sm sm:text-base h-10 sm:h-11"
                >
                  Enviar reserva
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
