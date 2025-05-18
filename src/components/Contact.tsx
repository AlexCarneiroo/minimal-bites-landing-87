
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-snackbar-peach/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Entre em Contato</h2>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Estamos ansiosos para ouvir você. Envie-nos uma mensagem ou visite-nos pessoalmente!
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-snackbar-dark">
                    Nome
                  </label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome" 
                    className="border-snackbar-gray/30 focus:border-snackbar-dark focus:ring-snackbar-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-snackbar-dark">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="border-snackbar-gray/30 focus:border-snackbar-dark focus:ring-snackbar-dark"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-snackbar-dark">
                  Assunto
                </label>
                <Input 
                  id="subject" 
                  placeholder="Assunto da mensagem" 
                  className="border-snackbar-gray/30 focus:border-snackbar-dark focus:ring-snackbar-dark"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-snackbar-dark">
                  Mensagem
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Escreva sua mensagem aqui..." 
                  className="border-snackbar-gray/30 focus:border-snackbar-dark focus:ring-snackbar-dark min-h-32"
                />
              </div>
              
              <Button className="w-full bg-snackbar-dark text-white hover:bg-black">
                Enviar Mensagem
              </Button>
            </form>
          </div>
          
          <div className="lg:w-1/2">
            <div className="h-full flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-snackbar-dark mb-6">Informações de Contato</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <MapPin className="w-5 h-5 text-snackbar-dark" />
                    </div>
                    <div>
                      <h4 className="font-medium text-snackbar-dark">Endereço</h4>
                      <p className="text-snackbar-gray">Rua das Delicias, 123, Centro, São Paulo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <Phone className="w-5 h-5 text-snackbar-dark" />
                    </div>
                    <div>
                      <h4 className="font-medium text-snackbar-dark">Telefone</h4>
                      <p className="text-snackbar-gray">(11) 99999-9999</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <Mail className="w-5 h-5 text-snackbar-dark" />
                    </div>
                    <div>
                      <h4 className="font-medium text-snackbar-dark">Email</h4>
                      <p className="text-snackbar-gray">contato@saborexpress.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117002.25399198493!2d-46.7030389!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2zU8OjbyBQYXVsbywgU1A!5e0!3m2!1spt-BR!2sbr!4v1716414016561!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
