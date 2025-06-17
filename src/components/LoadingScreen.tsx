import React from 'react';

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-primary">Carregando...</p>
    </div>
  </div>
);

export default LoadingScreen;
