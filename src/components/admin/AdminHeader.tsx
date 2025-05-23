
import { useNavigate } from 'react-router-dom';
import { Settings, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-snackbar-dark text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <h1 className="text-xl font-bold">Painel Administrativo</h1>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Ver Site
        </Button>
        <Button variant="destructive" onClick={onLogout}>Sair</Button>
      </div>
    </header>
  );
};

export default AdminHeader;
