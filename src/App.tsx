
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import LoadingScreen from '@/components/LoadingScreen';
import AdminRoute from '@/components/AdminRoute';
import DynamicTitle from '@/components/DynamicTitle';

const Index = lazy(() => import('@/pages/Index'));
const Admin = lazy(() => import('@/pages/Admin'));

function App() {
  return (
    <SiteSettingsProvider>
      <Router>
        <DynamicTitle />
        <div className="min-h-screen">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Suspense>
        </div>
        <Toaster />
      </Router>
    </SiteSettingsProvider>
  );
}

export default App;
