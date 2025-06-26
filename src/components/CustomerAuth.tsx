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
          description:"Senha ou Email incorretos",
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
      <DialogContent className="sm:max-w-md max-w-[90vw] w-full bg-gradient-to-br from-white via-gray-50 to-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div 
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl animate-fade-in transition-all duration-500 hover:scale-110"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
              border: `2px solid ${primaryColor}30`
            }}
          >
            <User className="w-10 h-10 animate-pulse" style={{ color: primaryColor }} />
          </div>
          <DialogTitle className="text-center text-3xl font-bold text-gray-800 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Área do Cliente
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm animate-fade-in" style={{ animationDelay: "200ms" }}>
            Acesse sua conta ou cadastre-se para continuar
          </p>
        </DialogHeader>

        {showReset ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recuperar Senha</h3>
              <p className="text-gray-600 text-sm">Digite seu email para receber as instruções</p>
            </div>
            
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Digite seu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 h-14 rounded-xl text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg text-base font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Enviando..." : "Enviar"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReset(false)}
                  className="flex-1 h-14 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-105 text-base font-medium"
                >
                  Voltar
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full animate-fade-in" style={{ animationDelay: "300ms" }}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1 h-12">
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300 text-base font-medium hover:scale-105"
                style={{ 
                  color: primaryColor,
                  '--tw-ring-color': primaryColor 
                } as React.CSSProperties}
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300 text-base font-medium hover:scale-105"
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
                  <Label htmlFor="login-email" className="text-gray-700 font-medium text-base">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Digite seu email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 font-medium text-base">Senha</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 rounded-xl text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl text-base font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowReset(true)}
                  className="w-full text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  style={{ color: primaryColor }}
                >
                  Esqueceu sua senha?
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-6 pt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-gray-700 font-medium text-base">Nome</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Digite seu nome"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-700 font-medium text-base">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Digite seu email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-phone" className="text-gray-700 font-medium text-base">Telefone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="Digite seu telefone"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                      className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-700 font-medium text-base">Senha</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-confirm" className="text-gray-700 font-medium text-base">Confirmar Senha</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="register-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      className="pl-12 pr-12 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base transition-all duration-300 hover:border-gray-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 rounded-xl text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl text-base font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerAuth;
