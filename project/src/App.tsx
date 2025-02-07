import React from 'react';
import Layout from './components/Layout';
import { useStore } from './lib/store';
import ChatHistory from './components/ChatHistory';
import { Toaster } from 'react-hot-toast';

function App() {
  const { darkMode } = useStore();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Layout>
        <div className="p-8 text-gray-900 dark:text-white min-h-screen">
          <ChatHistory />
        </div>
      </Layout>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;