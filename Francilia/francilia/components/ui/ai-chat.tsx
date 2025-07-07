'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Loader2,
  Sparkles,
  Film,
  Search,
  Settings,
  HelpCircle
} from 'lucide-react'
import { aiService, type ChatMessage } from '@/lib/ai-service'

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  message: string
}

const quickActions: QuickAction[] = [
  {
    id: 'recommend',
    label: 'Get Recommendations',
    icon: <Sparkles className="h-4 w-4" />,
    message: 'Can you recommend some movies for me?'
  },
  {
    id: 'search',
    label: 'Find Movies',
    icon: <Search className="h-4 w-4" />,
    message: 'Help me find a specific movie'
  },
  {
    id: 'account',
    label: 'Account Help',
    icon: <Settings className="h-4 w-4" />,
    message: 'I need help with my account'
  },
  {
    id: 'technical',
    label: 'Technical Support',
    icon: <HelpCircle className="h-4 w-4" />,
    message: 'I\'m having technical issues'
  }
]

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setShowQuickActions(false)

    try {
      const aiResponse = await aiService.sendMessage(messageToSend)
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('AI Chat Error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment, or contact our support team if the issue persists.",
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessages([])
    setShowQuickActions(true)
    setInputMessage('')
  }

  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-all duration-300"
          style={{ backgroundColor: '#a38725' }}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 z-50 bg-gray-900/95 border-gray-700 backdrop-blur-md shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a38725] to-yellow-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-sm">Francilia AI</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Content */}
          {!isMinimized && (
            <CardContent className="flex flex-col h-[520px] p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && showQuickActions && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#a38725] to-yellow-600 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Welcome to Francilia AI!</h3>
                      <p className="text-gray-400 text-sm">
                        I'm here to help you discover amazing content, answer questions, and provide support. How can I assist you today?
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          className="border-gray-600 text-white hover:bg-gray-800 text-xs p-2 h-auto flex flex-col items-center gap-1"
                        >
                          {action.icon}
                          <span className="text-center leading-tight">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a38725] to-yellow-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-[#a38725] text-white'
                          : 'bg-gray-800 text-white border border-gray-700'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a38725] to-yellow-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 text-white border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about movies, your account, or get help..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#a38725]"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: '#a38725' }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {messages.length > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetChat}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      New Conversation
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Film className="h-3 w-3" />
                      <span>Powered by Francilia AI</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}