import React, { useState, useRef, useEffect } from 'react'
    import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react'

    interface Message {
      sender: 'user' | 'agent'
      text: string
    }

    // IMPORTANT: Replace this URL if your n8n webhook is different
    const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/fanya'

    // Function to generate a simple random ID
    const generateSessionId = () => {
      return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }

    function App() {
      const [messages, setMessages] = useState<Message[]>([
        { sender: 'agent', text: 'Olá! Como posso ajudar você hoje?' },
      ])
      const [inputValue, setInputValue] = useState('')
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState<string | null>(null)
      const [sessionId, setSessionId] = useState<string>(''); // State for sessionId
      const messagesEndRef = useRef<HTMLDivElement>(null)

      // Generate sessionId once when the component mounts
      useEffect(() => {
        setSessionId(generateSessionId());
      }, []); // Empty dependency array ensures this runs only once

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }

      useEffect(() => {
        scrollToBottom()
      }, [messages])

      const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        setInputValue(event.target.value)
        setError(null) // Clear error when user types
      }

      const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim()
        if (!trimmedInput || isLoading || !sessionId) return // Don't send if no input, loading, or no sessionId

        const newUserMessage: Message = { sender: 'user', text: trimmedInput }
        setMessages((prevMessages) => [...prevMessages, newUserMessage])
        setInputValue('')
        setIsLoading(true)
        setError(null) // Clear previous errors

        try {
          const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Include both message and sessionId in the request body
            body: JSON.stringify({
              message: trimmedInput,
              sessionId: sessionId // Add the generated sessionId
            }),
          })

          if (!response.ok) {
            let errorDetails = `Erro na comunicação: ${response.status}`
            try {
              const errorData = await response.json();
              errorDetails += ` - ${JSON.stringify(errorData)}`; // Complete the template literal
            } catch (jsonError) {
              // Ignore if response is not JSON
            }
            throw new Error(errorDetails);
          }

          // Assuming n8n responds with { "response": "agent message" }
          // Adjust parsing based on your actual n8n workflow response
          const data = await response.json()
          const agentResponse = data.response || data.message || 'Desculpe, não entendi.' // Fallback response

          const newAgentMessage: Message = {
            sender: 'agent',
            text: agentResponse,
          }
          setMessages((prevMessages) => [...prevMessages, newAgentMessage])

        } catch (err: any) {
          console.error('Erro ao enviar mensagem:', err)
          setError(err.message || 'Ocorreu um erro ao conectar com o agente.')
          // Optionally add an error message to the chat
          // const errorMessage: Message = { sender: 'agent', text: `Erro: ${err.message || 'Não foi possível conectar.'}` };
          // setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false)
        }
      }

      const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoading) {
          handleSendMessage()
        }
      }

      return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
          {/* Header */}
          <header className="bg-white shadow-md p-4 flex items-center gap-3 sticky top-0 z-10">
            <Bot className="text-blue-600 h-8 w-8" />
            <h1 className="text-xl font-semibold text-gray-800">n8n Chat Agent</h1>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-2 text-white">
                    <Bot size={20} />
                  </div>
                )}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                 {msg.sender === 'user' && (
                  <div className="flex-shrink-0 bg-gray-300 rounded-full p-2 text-gray-700">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start items-center gap-3">
                 <div className="flex-shrink-0 bg-blue-500 rounded-full p-2 text-white">
                    <Bot size={20} />
                  </div>
                <div className="bg-white text-gray-500 px-4 py-2 rounded-lg shadow rounded-bl-none inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Digitando...
                </div>
              </div>
            )}
             {/* Error Message Display */}
            {error && (
              <div className="flex justify-center">
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm shadow">
                   {error}
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-gray-200 sticky bottom-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`p-2 rounded-full text-white transition duration-150 ease-in-out ${
                  isLoading || !inputValue.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <SendHorizontal size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      )
    }

    export default App
