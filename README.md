# 🍽️ Landing Page para Estabelecimentos - Sistema Completo

Uma plataforma moderna e completa para criar landing pages profissionais para restaurantes, lanchonetes, pizzarias e outros estabelecimentos gastronômicos.

## 🚀 **Visão Geral**

Este projeto é uma solução completa que permite aos estabelecimentos criarem landing pages profissionais com sistema de reservas, gerenciamento de conteúdo, autenticação de clientes e painel administrativo integrado.

## ✨ **Funcionalidades Principais**

### 🎯 **Frontend (Página Principal)**
- **Hero Section** com chamada para ação e reservas
- **Menu de Produtos** com categorização e filtros
- **Galeria de Imagens** com carrossel interativo
- **Seção Sobre** com informações do estabelecimento
- **Depoimentos de Clientes** com sistema de feedback
- **Sistema de Reservas** inteligente com horários baseados no funcionamento
- **Autenticação de Clientes** para reservas e perfil
- **Título Dinâmico** baseado no nome do estabelecimento
- **Design Responsivo** para todos os dispositivos

### 🛠️ **Painel Administrativo**
- **Configurações Gerais** do estabelecimento
- **Personalização de Aparência** (cores, imagens, layout)
- **Gerenciamento de Reservas** com status e confirmações
- **Sistema de Ofertas Especiais** com editor visual
- **Gestão de Depoimentos** de clientes
- **Configuração de Produtos em Destaque**
- **Seção Sobre Nós** personalizável
- **Configurações do Footer** e informações de contato

### 🔐 **Sistema de Autenticação**
- **Login/Cadastro de Clientes** para reservas
- **Perfil do Cliente** com histórico de reservas
- **Autenticação de Administradores** com controle de acesso
- **Recuperação de Senha** integrada

### 📅 **Sistema de Reservas Inteligente**
- **Calendário em Português** com seleção de datas
- **Horários Dinâmicos** baseados no funcionamento do estabelecimento
- **Intervalos de 20 minutos** configuráveis
- **Validação de Disponibilidade** por dia da semana
- **Confirmação e Status** das reservas

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Framer Motion** para animações
- **React Hook Form** com Zod para validação
- **React Router DOM** para navegação

### **Backend & Banco de Dados**
- **Firebase** (Firestore, Authentication, Storage)
- **Firebase Operations** para operações CRUD
- **Real-time Database** para dados em tempo real

### **Bibliotecas Principais**
- **date-fns** para manipulação de datas
- **lucide-react** para ícones
- **sonner** para notificações
- **react-day-picker** para calendário
- **embla-carousel-react** para carrosséis

## 📦 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta Firebase

### **1. Clone o Repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd leandpage-1
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configure o Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication, Firestore e Storage
3. Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### **4. Execute o Projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🏗️ **Estrutura do Projeto**

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── admin/          # Componentes do painel admin
│   └── ...             # Componentes específicos
├── pages/              # Páginas da aplicação
│   ├── admin/          # Páginas administrativas
│   └── api/            # Endpoints da API
├── hooks/              # Custom hooks
├── contexts/           # Contextos React
├── lib/                # Utilitários e configurações
└── main.tsx           # Ponto de entrada
```

## 🎨 **Personalização**

### **Cores e Tema**
- Sistema de cores personalizável via painel admin
- Suporte a temas claros/escuros
- Cores primárias e secundárias configuráveis

### **Conteúdo**
- Nome e descrição do estabelecimento
- Horários de funcionamento
- Produtos em destaque
- Imagens e galeria
- Informações de contato

### **Funcionalidades**
- Seções opcionais (menu, depoimentos, etc.)
- Sistema de reservas configurável
- Integração com redes sociais
- Links para cardápio e localização

## 🔧 **Configuração do Firebase**

### **Regras do Firestore**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Configurações gerais - leitura pública
    match /general_settings/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Reservas - usuários autenticados podem criar
    match /reservations/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Feedbacks - leitura pública, escrita autenticada
    match /feedbacks/{document} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

### **Regras do Storage**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 **Deploy**

### **Vercel (Recomendado)**
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### **Netlify**
1. Conecte o repositório
2. Configure build command: `npm run build`
3. Configure publish directory: `dist`

### **Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📱 **Recursos Responsivos**

- **Mobile First** design
- **Tablet** otimizado
- **Desktop** com layout avançado
- **Touch gestures** para mobile
- **Performance** otimizada

## 🔒 **Segurança**

- **Autenticação Firebase** segura
- **Validação de formulários** com Zod
- **Sanitização de dados** de entrada
- **Controle de acesso** por roles
- **HTTPS** obrigatório em produção

## 📊 **Monitoramento**

- **Console logs** estruturados
- **Error boundaries** para captura de erros
- **Performance monitoring** (opcional)
- **Analytics** integrado (opcional)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 **Suporte**

- **Documentação**: [Link para docs]
- **Issues**: [GitHub Issues]
- **Email**: [seu-email@exemplo.com]

## 🎯 **Roadmap**

- [ ] **Sistema de Pedidos Online**
- [ ] **Integração com WhatsApp**
- [ ] **Sistema de Fidelidade**
- [ ] **Múltiplos Idiomas**
- [ ] **PWA (Progressive Web App)**
- [ ] **Analytics Avançado**
- [ ] **Sistema de Cupons**
- [ ] **Integração com iFood/Rappi**

---

**Desenvolvido com ❤️ para revolucionar a presença digital dos estabelecimentos gastronômicos**
