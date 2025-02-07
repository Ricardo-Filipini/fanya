import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Send, Minimize2, Maximize2, PlusCircle } from 'lucide-react';
import { geminiCompletion } from '../lib/gemini';
import { supabase } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const { 
    chatExpanded, 
    toggleChat, 
    currentConversationId,
    messages: storeMessages,
    addMessage,
    setCurrentConversation,
    setMessages 
  } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startNewConversation = async () => {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert([
        { title: 'Nova Conversa' }
      ])
      .select()
      .single();

    if (convError) {
      console.error('Erro ao criar nova conversa:', convError);
      return;
    }

    setCurrentConversation(conversation.id);
    setMessages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    
    if (!currentConversationId) {
      await startNewConversation();
    }

    const { error: msgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: currentConversationId,
          role: newMessage.role,
          content: newMessage.content
        }
      ]);

    if (msgError) {
      console.error('Erro ao salvar mensagem:', msgError);
      return;
    }

    addMessage(newMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiCompletion([...storeMessages, newMessage]);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0].message.content,
      };

      await supabase
        .from('messages')
        .insert([
          {
            conversation_id: currentConversationId,
            role: assistantMessage.role,
            content: assistantMessage.content
          }
        ]);

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className={`font-semibold text-gray-900 dark:text-white ${chatExpanded ? '' : 'hidden'}`}>
            Assistente IA
          </h2>
          {chatExpanded && (
            <button
              onClick={startNewConversation}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
            >
              <PlusCircle size={20} />
              <span>Nova Conversa</span>
            </button>
          )}
        </div>
        <button onClick={toggleChat} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          {chatExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {chatExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {storeMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <ReactMarkdown
                    className="prose dark:prose-invert max-w-none"
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="bg-gray-800 dark:bg-gray-900 rounded-md p-2 my-2">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-gray-800 dark:bg-gray-900 rounded px-1" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                  Pensando...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}