
import { useNavigate } from 'react-router-dom';
import { Settings, Home, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700/50"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-sm">
            <Settings className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-xs text-slate-400">Sistema de gerenciamento</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={()=> window.location.href = '/'}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300"
            >
                <Home className="mr-2 h-4 w-4" />
                Ver Site
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="bg-red-500/80 hover:bg-red-600 rounded-xl transition-all duration-300 shadow-lg"
            >
              <User className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
