import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon, Clock, User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // ajuste o path conforme necessário


// Define form schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  date: z.date({ required_error: 'Selecione uma data' }),
  time: z.string({ required_error: 'Selecione um horário' }),
  guests: z.string({ required_error: 'Selecione o número de pessoas' }),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReservationFormProps {
  onSuccess?: () => void;
}

const ReservationForm = ({ onSuccess }: ReservationFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialRequests: '',
    },
  });

  // Generate time slots from 11:00 to 22:00
  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = i + 11;
    if (hour > 22) return null;
    return `${hour}:00`;
  }).filter(Boolean) as string[];

  // Generate guest options from 1 to 10
  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? 'pessoa' : 'pessoas'}`,
  }));

const onSubmit = async (data: FormValues) => {
  try {

    const reservationData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      guests: Number(data.guests),
      message: data.specialRequests || '',
      status: 'pending',
      createdAt: Timestamp.now(),
    };


    const docRef = await addDoc(collection(db, 'reservations'), reservationData);
    toast({
      title: 'Reserva realizada com sucesso!',
      description: `${data.name}, sua reserva para ${data.guests} no dia ${format(data.date, 'PP', { locale: pt })} às ${data.time} foi confirmada.`,
    });

    if (onSuccess) onSuccess();
    form.reset();
  } catch (error) {
    console.error("Erro detalhado ao salvar no Firebase:", error);
    toast({
      title: 'Erro ao salvar reserva',
      description: 'Tente novamente mais tarde.',
      variant: 'destructive',
    });
  }
};



  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Faça sua Reserva</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Seu nome completo" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="seu.email@exemplo.com" type="email" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="(00) 00000-0000" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PP", { locale: pt })
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        // Disable past dates
                        return date < new Date(new Date().setHours(0, 0, 0, 0));
                      }}
                      initialFocus
                      locale={pt}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Field */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Selecione um horário" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Guests Field */}
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de pessoas</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Selecione o número de pessoas" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {guestOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Requests */}
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitações especiais (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Mesa perto da janela, aniversário, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Confirmar Reserva
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReservationForm;
