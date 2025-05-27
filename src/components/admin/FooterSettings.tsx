import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FooterData {
  copyright: string;
  companyName: string;
  additionalText: string;
}

interface FooterSettingsProps {
  footerData: FooterData;
  onSave: (data: FooterData) => void;
}

export default function FooterSettings({
  footerData,
  onSave
}: FooterSettingsProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FooterData>(footerData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(formData);
      toast({
        title: "Footer atualizado",
        description: "As configurações do footer foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar as configurações do footer",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof FooterData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="copyright">Texto de Copyright</Label>
          <Input
            id="copyright"
            value={formData.copyright}
            onChange={(e) => handleChange('copyright', e.target.value)}
            placeholder="© 2024 Todos os direitos reservados."
          />
        </div>

        <div>
          <Label htmlFor="companyName">Nome da Empresa</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Nome da sua empresa"
          />
        </div>

        <div>
          <Label htmlFor="additionalText">Texto Adicional</Label>
          <Textarea
            id="additionalText"
            value={formData.additionalText}
            onChange={(e) => handleChange('additionalText', e.target.value)}
            placeholder="Texto adicional que aparecerá no footer"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
} 