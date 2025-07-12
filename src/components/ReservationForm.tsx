import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { pt } from 'date-fns/locale';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';

interface ReservationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ReservationForm = ({ onClose, onSuccess }: ReservationFormProps) => {
  const { customerData, isLoggedIn } = useCustomerAuth(); // seu hook para dados do usuário logado
  const { settings } = useSiteSettings();
  const { data: establishmentData, getAvailableTimesForDate } = useEstablishmentData();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const { toast } = useToast();
  const corPrincipal = settings?.primaryColor || '';

  const FormSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um email válido." }),
    phone: z.string().min(10, { message: "Número de telefone deve ter pelo menos 10 dígitos." }),
    date: z.string().min(1, { message: "Por favor, selecione uma data." }),
    time: z.string().min(1, { message: "Por favor, selecione um horário." }),
    guests: z.number().min(1, { message: "Deve haver pelo menos 1 convidado." }),
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

  // Atualiza campos caso logue depois do form abrir
  useEffect(() => {
    if (isLoggedIn && customerData) {
      form.setValue("name", customerData.name || "");
      form.setValue("email", customerData.email || "");
      form.setValue("phone", customerData.phone || "");
    }
  }, [isLoggedIn, customerData]);

  // Atualiza horários disponíveis quando a data muda
  useEffect(() => {
    if (date) {
      const times = getAvailableTimesForDate(date);
      setAvailableTimes(times);
      // Limpa o horário selecionado se não estiver mais disponível
      const currentTime = form.getValues("time");
      if (currentTime && !times.includes(currentTime)) {
        form.setValue("time", "");
      }
    } else {
      setAvailableTimes([]);
    }
  }, [date, getAvailableTimesForDate]);

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

  // Formata a data para exibição
  const formatDate = (dateValue: string) => {
    if (!dateValue) return null;
    try {
      const parsedDate = parseISO(dateValue);
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd/MM/yyyy", { locale: pt });
      }
      const date = new Date(dateValue);
      if (isValid(date)) {
        return format(date, "dd/MM/yyyy", { locale: pt });
      }
      return null;
    } catch {
      return null;
    }
  };

  if (establishmentData && establishmentData.reservationsEnabled === false) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-[500px] h-[40vh] max-h-[40vh] flex items-center justify-center">
          <div className="w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Sem reservas no momento</h2>
            <p className="text-gray-500">As reservas online estão temporariamente desabilitadas. Por favor, tente novamente mais tarde.</p>
            <Button className="mt-6" onClick={onClose} style={{ backgroundColor: corPrincipal }}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[500px] h-[85vh] max-h-[85vh] p-0 overflow-hidden animate-scale-in">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold text-gray-800 animate-fade-in">
            🍽️ Reserva de Mesa
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base text-gray-600 animate-fade-in" style={{ animationDelay: "100ms" }}>
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
                  <FormItem className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        {...field}
                        readOnly={isLoggedIn}
                        className={cn(
                          "text-sm sm:text-base h-12 sm:h-14 border-2 rounded-xl transition-all duration-300 hover:border-gray-400 focus:border-blue-500",
                          isLoggedIn ? "bg-gray-50 cursor-not-allowed" : "hover:shadow-md focus:shadow-lg"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                    {isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1 animate-pulse">
                        ✓ Campo preenchido automaticamente
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        readOnly={isLoggedIn}
                        className={cn(
                          "text-sm sm:text-base h-12 sm:h-14 border-2 rounded-xl transition-all duration-300 hover:border-gray-400 focus:border-blue-500",
                          isLoggedIn ? "bg-gray-50 cursor-not-allowed" : "hover:shadow-md focus:shadow-lg"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                    {isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1 animate-pulse">
                        ✓ Campo preenchido automaticamente
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Telefone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        {...field}
                        readOnly={isLoggedIn}
                        className={cn(
                          "text-sm sm:text-base h-12 sm:h-14 border-2 rounded-xl transition-all duration-300 hover:border-gray-400 focus:border-blue-500",
                          isLoggedIn ? "bg-gray-50 cursor-not-allowed" : "hover:shadow-md focus:shadow-lg"
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                    {isLoggedIn && (
                      <p className="text-xs text-gray-500 mt-1 animate-pulse">
                        ✓ Campo preenchido automaticamente
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {establishmentData?.schedule && (
                <div className="animate-fade-in" style={{ animationDelay: "450ms" }}>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-1">Horário de Funcionamento:</p>
                    <p className="text-xs text-blue-700">
                      Dias úteis: {establishmentData.schedule.weekdays || 'Não definido'} | 
                      Fins de semana: {establishmentData.schedule.weekends || 'Não definido'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:space-x-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal text-sm sm:text-base h-12 sm:h-14 border-2 rounded-xl transition-all duration-300 hover:border-gray-400 hover:shadow-md",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value) || "Data inválida"
                              ) : (
                                <span>📅 Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 animate-scale-in" align="start">
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
                      <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Horário</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={!date || availableTimes.length === 0}
                          className="
    flex h-12 w-full rounded-xl
    border-2 border-gray-200
    bg-white/80 backdrop-blur-sm
    px-4 py-3 text-base
    placeholder:text-gray-400
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    focus:border-primary focus:bg-white
    transition-all duration-300
    disabled:cursor-not-allowed disabled:opacity-50
    md:text-sm shadow-sm hover:shadow-md focus:shadow-lg
  "
                        >
                          <option value="">Selecione um horário</option>
                          {availableTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                      {!date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Selecione uma data primeiro
                        </p>
                      )}
                      {date && availableTimes.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          Nenhum horário disponível para esta data
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{ animationDelay: "600ms" }}>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Número de convidados</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        className="text-sm sm:text-base h-12 sm:h-14 border-2 rounded-xl transition-all duration-300 hover:border-gray-400 focus:border-blue-500 hover:shadow-md focus:shadow-lg"
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
                  <FormItem className="animate-fade-in" style={{ animationDelay: "700ms" }}>
                    <FormLabel className="text-sm sm:text-base font-medium text-gray-700">Mensagem (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="💬 Alguma observação?"
                        {...field}
                        className="text-sm sm:text-base h-12 sm:h-14 border-2 rounded-xl transition-all duration-300 hover:border-gray-400 focus:border-blue-500 hover:shadow-md focus:shadow-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <div className="pt-4 justify-center flex animate-fade-in" style={{ animationDelay: "800ms" }}>
                <button
                  style={{ backgroundColor: corPrincipal }}
                  type="submit"
                  className="w-[90%] text-sm sm:text-base h-12 sm:h-14 bg-gradient-to-r  text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl font-medium"
                >
                  🎉 Enviar reserva
                </button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
