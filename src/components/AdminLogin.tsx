
import { useState, useEffect } from 'react';
import { Lock, User, Sparkles, Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { checkOwnerExists, signInOwner } from '@/lib/firebase-auth';
import OwnerSetup from './admin/OwnerSetup';
import PasswordRecovery from './admin/PasswordRecovery';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(true);
  const [ownerExists, setOwnerExists] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkOwner = async () => {
      const exists = await checkOwnerExists();
      setOwnerExists(exists);
      setCheckingOwner(false);
    };
    
    checkOwner();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    const result = await signInOwner(username, password);
    
    if (result.success) {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
      onLogin();
    } else {
      toast({
        title: "Erro no login",
        description: result.error || "Credenciais inválidas",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleSetupComplete = () => {
    setOwnerExists(true);
    toast({
      title: "Configuração concluída!",
      description: "Agora você pode fazer login com suas credenciais",
    });
  };

  if (checkingOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!ownerExists) {
    return <OwnerSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-primary to-purple-600 bg-clip-text text-transparent mb-2">
                Painel Administrativo
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Faça login para acessar o painel de controle
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {showRecovery ? (
              <PasswordRecovery onBack={() => setShowRecovery(false)} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                    <Input
                      id="username"
                      type="email"
                      placeholder="Digite seu email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-12 h-14 text-base"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 text-base"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="space-y-3"
                >
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold gap-2"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Entrar no Painel
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowRecovery(true)}
                    className="w-full text-sm text-gray-600 hover:text-primary"
                  >
                    Esqueceu sua senha?
                  </Button>
                </motion.div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
