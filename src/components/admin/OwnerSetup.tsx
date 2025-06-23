
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setupOwner } from '@/lib/firebase-auth';

interface OwnerSetupProps {
  onSetupComplete: () => void;
}

const OwnerSetup = ({ onSetupComplete }: OwnerSetupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const result = await setupOwner(formData.email, formData.password, formData.name);
    
    if (result.success) {
      toast({
        title: "Configuração concluída!",
        description: "Seu painel administrativo foi configurado com sucesso",
      });
      onSetupComplete();
    } else {
      toast({
        title: "Erro na configuração",
        description: result.error || "Erro desconhecido",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-primary/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-purple-500"></div>
          
          <CardHeader className="space-y-1 text-center pb-8 pt-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div className="p-4 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Configuração Inicial
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Configure suas credenciais de proprietário
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nome Completo
                </label>
                <Input
                  placeholder="Digite seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Confirmar Senha
                </label>
                <Input
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold gap-2"
                disabled={loading}
              >
                {loading ? "Configurando..." : (
                  <>
                    Configurar Painel
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OwnerSetup;
