import React from 'react';
import { useStore } from '../lib/store';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { Menu, MessageSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarExpanded, chatExpanded, toggleSidebar, toggleChat } = useStore();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div 
        className={`${
          sidebarExpanded ? 'w-64' : 'w-16'
        } transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <Sidebar />
      </div>
      
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-4 left-4 p-2 bg-blue-600 text-white rounded-full shadow-lg z-50"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>

      {/* Right Chat Panel */}
      <div 
        className={`${
          chatExpanded ? 'w-96' : 'w-16'
        } transition-all duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 flex-shrink-0`}
      >
        <Chat />
      </div>

      {/* Mobile chat toggle */}
      <button
        className="lg:hidden fixed bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg z-50"
        onClick={toggleChat}
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}