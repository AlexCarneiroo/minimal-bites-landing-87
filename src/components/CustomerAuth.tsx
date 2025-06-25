import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { signInCustomer, registerCustomer, resetCustomerPassword } from '@/lib/firebase-customer-auth';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface CustomerAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomerAuth = ({ isOpen, onClose, onSuccess }: CustomerAuthProps) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInCustomer(loginForm.email, loginForm.password);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Credenciais inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await registerCustomer(
        registerForm.email,
        registerForm.password,
        registerForm.name,
        registerForm.phone
      );
      
      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada!",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.error || "Erro ao criar conta",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await resetCustomerPassword(resetEmail);
      
      if (result.success) {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha",
        });
        setShowReset(false);
        setResetEmail('');
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao enviar email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] w-full bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <User className="w-8 h-8" style={{ color: primaryColor }} />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Área do Cliente
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Acesse sua conta ou cadastre-se para continuar
          </p>
        </DialogHeader>

        {showReset ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recuperar Senha</h3>
              <p className="text-gray-600 text-sm">Digite seu email para receber as instruções</p>
            </div>
            
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Digite seu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 h-12 rounded-xl text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Enviando..." : "Enviar"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReset(false)}
                  className="flex-1 h-12 rounded-xl border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                style={{ 
                  color: primaryColor,
                  '--tw-ring-color': primaryColor 
                } as React.CSSProperties}
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                style={{ 
                  color: primaryColor,
                  '--tw-ring-color': primaryColor 
                } as React.CSSProperties}
              >
                Cadastrar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6 pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Digite seu email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 rounded-xl text-white hover:opacity-90 transition-opacity shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowReset(true)}
                  className="w-full text-sm hover:bg-gray-100 transition-colors"
                  style={{ color: primaryColor }}
                >
                  Esqueceu sua senha?
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-6 pt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-gray-700 font-medium">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Digite seu nome"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Digite seu email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-phone" className="text-gray-700 font-medium">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="Digite seu telefone"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-700 font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-confirm" className="text-gray-700 font-medium">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="register-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 rounded-xl text-white hover:opacity-90 transition-opacity shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerAuth;
