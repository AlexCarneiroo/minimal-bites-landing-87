
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetOwnerPassword } from '@/lib/firebase-auth';

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite seu email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const result = await resetOwnerPassword(email);
    
    if (result.success) {
      setSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha",
      });
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao enviar email",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Email Enviado!</h3>
          <p className="text-gray-600">
            Enviamos um link para redefinir sua senha para <strong>{email}</strong>
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Login
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Recuperar Senha</h3>
        <p className="text-gray-600">
          Digite seu email para receber o link de recuperação
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email
          </label>
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-3">
          <Button 
            type="submit" 
            className="w-full h-12 gap-2"
            disabled={loading}
          >
            {loading ? "Enviando..." : (
              <>
                <Send className="w-4 h-4" />
                Enviar Link de Recuperação
              </>
            )}
          </Button>

          <Button 
            type="button"
            variant="outline" 
            onClick={onBack}
            className="w-full h-12 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Login
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PasswordRecovery;
