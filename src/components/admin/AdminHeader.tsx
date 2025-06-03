
import { useNavigate } from 'react-router-dom';
import { Settings, Home, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden p-6 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700' 
          : 'bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-200'
      } backdrop-blur-lg shadow-2xl`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className={`p-3 rounded-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25'
          }`}>
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gerencie suas configurações
            </p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              onClick={toggleTheme}
              className={`relative overflow-hidden border-2 transition-all duration-300 ${
                isDark 
                  ? 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 hover:border-gray-500' 
                  : 'border-gray-200 bg-white/70 hover:bg-gray-50 text-gray-700 hover:border-gray-300'
              } backdrop-blur-sm shadow-lg hover:shadow-xl`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
              <span className="ml-2 font-medium">
                {isDark ? 'Claro' : 'Escuro'}
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className={`relative overflow-hidden border-2 transition-all duration-300 ${
                isDark 
                  ? 'border-blue-500 bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 hover:border-blue-400' 
                  : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:border-blue-400'
              } backdrop-blur-sm shadow-lg hover:shadow-xl`}
            >
              <Home className="mr-2 h-5 w-5" />
              <span className="font-medium">Ver Site</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
