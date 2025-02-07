import React from 'react';
import { useStore } from '../lib/store';
import { Settings, Sun, Moon, Home, LogIn, Users, FileText, Calendar, Database, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const { sidebarExpanded, darkMode, toggleDarkMode } = useStore();

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center mb-8">
          {sidebarExpanded ? (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Assistente IA</h1>
          ) : (
            <Home size={24} className="text-gray-900 dark:text-white" />
          )}
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <LogIn size={20} />
                {sidebarExpanded && <span className="ml-3">Entrar</span>}
              </button>
            </li>
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <MessageSquare size={20} />
                {sidebarExpanded && <span className="ml-3">Histórico de Chat</span>}
              </button>
            </li>
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <Users size={20} />
                {sidebarExpanded && <span className="ml-3">Usuários</span>}
              </button>
            </li>
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <FileText size={20} />
                {sidebarExpanded && <span className="ml-3">Documentos</span>}
              </button>
            </li>
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <Calendar size={20} />
                {sidebarExpanded && <span className="ml-3">Calendário</span>}
              </button>
            </li>
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <Database size={20} />
                {sidebarExpanded && <span className="ml-3">Base de Dados</span>}
              </button>
            </li>
            <li>
              <button className="flex items-center w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                <Settings size={20} />
                {sidebarExpanded && <span className="ml-3">Configurações</span>}
              </button>
            </li>
          </ul>
        </nav>

        <button
          onClick={toggleDarkMode}
          className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {sidebarExpanded && (
            <span className="ml-3">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          )}
        </button>
      </div>
    </div>
  );
}