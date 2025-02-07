import React, { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { supabase, testConnection } from '../lib/supabaseClient';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatHistory() {
  const { conversations, setConversations, setCurrentConversation, setMessages } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    loadConversations();
  }, []);

  async function checkConnection() {
    const isConnected = await testConnection();
    if (!isConnected) {
      toast.error('Erro ao conectar com o Supabase. Verifique sua conexão.');
    }
    setIsLoading(false);
  }

  async function loadConversations() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar conversas:', error);
        toast.error('Erro ao carregar conversas');
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar conversas');
    }
  }

  async function loadMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at');

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        toast.error('Erro ao carregar mensagens');
        return;
      }

      setMessages(data || []);
      setCurrentConversation(conversationId);
      toast.success('Conversa carregada com sucesso');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar mensagens');
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Histórico de Conversas</h2>
      <div className="space-y-3">
        {conversations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Nenhuma conversa encontrada</p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => loadMessages(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="text-blue-500" size={20} />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{conversation.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}