import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@/types';

interface MessagingSystemProps {
  orderId?: string;
  restaurantId?: string;
  onClose?: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'manager' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'order_update' | 'system';
  orderId?: string;
  read: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'order' | 'support' | 'general';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  orderId?: string;
  restaurantId?: string;
}

export default function MessagingSystem({ orderId, restaurantId, onClose }: MessagingSystemProps) {
  const { user } = useAuth() as { user: User };
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user's chat rooms
  const { data: chatRooms } = useQuery<ChatRoom[]>({
    queryKey: ['/api/messages/chatrooms', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/messages/chatrooms/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms');
      }
      return response.json();
    },
  });

  // Fetch messages for active chat
  const { data: messages } = useQuery<Message[]>({
    queryKey: ['/api/messages', activeChat],
    enabled: !!activeChat,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    queryFn: async () => {
      const response = await fetch(`/api/messages/${activeChat}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/messages', {
        chatRoomId: activeChat,
        senderId: user?.id,
        content,
        type: 'text',
      });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage('');
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: error.message || 'Failed to send message. Please try again.',
      });
    },
  });

  // Mock chat rooms data
  const mockChatRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Order #ORD-001 - Canteen Delight',
      type: 'order',
      participants: [user?.id || '1', 'manager1'],
      unreadCount: 2,
      orderId: 'ORD-001',
      restaurantId: '1',
      lastMessage: {
        id: '1',
        senderId: 'manager1',
        senderName: 'Manager - Canteen Delight',
        senderType: 'manager',
        content: 'Your order is being prepared and will be ready in 15 minutes.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        read: false,
      },
    },
    {
      id: '2',
      name: 'Order #ORD-002 - North Spice Dhaba',
      type: 'order',
      participants: [user?.id || '1', 'manager2'],
      unreadCount: 0,
      orderId: 'ORD-002',
      restaurantId: '2',
      lastMessage: {
        id: '2',
        senderId: user?.id || '1',
        senderName: user?.employeeName || 'You',
        senderType: 'user',
        content: 'Thank you for the delicious food!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        read: true,
      },
    },
    {
      id: '3',
      name: 'Customer Support',
      type: 'support',
      participants: [user?.id || '1', 'support1'],
      unreadCount: 1,
      lastMessage: {
        id: '3',
        senderId: 'support1',
        senderName: 'Support Team',
        senderType: 'system',
        content: 'How can we help you today?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'text',
        read: false,
      },
    },
  ];

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'manager1',
      senderName: 'Manager - Canteen Delight',
      senderType: 'manager',
      content: 'Hello! Your order has been received.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      read: true,
    },
    {
      id: '2',
      senderId: user?.id || '1',
      senderName: user?.employeeName || 'You',
      senderType: 'user',
      content: 'Hi! Can I get extra spice in my curry?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text',
      read: true,
    },
    {
      id: '3',
      senderId: 'manager1',
      senderName: 'Manager - Canteen Delight',
      senderType: 'manager',
      content: 'Sure! I\'ll make sure to add extra spice.',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: 'text',
      read: true,
    },
    {
      id: '4',
      senderId: 'system',
      senderName: 'System',
      senderType: 'system',
      content: 'Your order status has been updated to "Preparing"',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'order_update',
      orderId: 'ORD-001',
      read: true,
    },
    {
      id: '5',
      senderId: 'manager1',
      senderName: 'Manager - Canteen Delight',
      senderType: 'manager',
      content: 'Your order is being prepared and will be ready in 15 minutes.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      read: false,
    },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set active chat if orderId is provided
  useEffect(() => {
    if (orderId && chatRooms) {
      const orderChat = chatRooms.find(room => room.orderId === orderId);
      if (orderChat) {
        setActiveChat(orderChat.id);
      }
    }
  }, [orderId, chatRooms]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChat) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSenderAvatar = (senderType: string, senderName: string) => {
    const initials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
    return initials;
  };

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case 'manager':
        return 'bg-blue-500';
      case 'system':
        return 'bg-gray-500';
      case 'user':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const chatRoomsData = chatRooms || mockChatRooms;
  const messagesData = messages || mockMessages;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-comments mr-2 text-primary"></i>
              Messages
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <i className="fas fa-times"></i>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="mt-0">
              <div className="flex h-96">
                {/* Chat List */}
                <div className="w-1/3 border-r border-border">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-medium text-foreground">Recent Chats</h3>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="space-y-1">
                      {chatRoomsData.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                            activeChat === chat.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => setActiveChat(chat.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {chat.name}
                            </h4>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {chat.lastMessage && (
                            <div className="text-xs text-muted-foreground">
                              <p className="truncate">{chat.lastMessage.content}</p>
                              <p>{formatTime(chat.lastMessage.timestamp)}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 flex flex-col">
                  {activeChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className={getSenderColor('manager')}>
                              M
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-foreground">
                              {chatRoomsData.find(c => c.id === activeChat)?.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">Online</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messagesData.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.senderType === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className={`text-xs ${getSenderColor(message.senderType)}`}>
                                    {getSenderAvatar(message.senderType, message.senderName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`space-y-1 ${message.senderType === 'user' ? 'text-right' : ''}`}>
                                  <div className={`p-3 rounded-lg ${
                                    message.senderType === 'user' 
                                      ? 'bg-primary text-primary-foreground' 
                                      : message.senderType === 'system'
                                      ? 'bg-muted text-muted-foreground'
                                      : 'bg-muted/50 text-foreground'
                                  }`}>
                                    {message.type === 'order_update' ? (
                                      <div className="flex items-center space-x-2">
                                        <i className="fas fa-info-circle"></i>
                                        <span className="text-sm">{message.content}</span>
                                      </div>
                                    ) : (
                                      <p className="text-sm">{message.content}</p>
                                    )}
                                  </div>
                                  <div className={`text-xs text-muted-foreground ${message.senderType === 'user' ? 'text-right' : ''}`}>
                                    {message.senderName} • {formatTime(message.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-4 border-t border-border">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={sendMessageMutation.isPending}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sendMessageMutation.isPending}
                          >
                            {sendMessageMutation.isPending ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-paper-plane"></i>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <i className="fas fa-comments text-4xl text-muted-foreground mb-4"></i>
                        <h3 className="text-lg font-medium text-foreground mb-2">Select a chat</h3>
                        <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-0">
              <div className="p-6">
                <div className="text-center">
                  <i className="fas fa-headset text-4xl text-muted-foreground mb-4"></i>
                  <h3 className="text-lg font-medium text-foreground mb-2">Customer Support</h3>
                  <p className="text-muted-foreground mb-6">
                    Need help? Our support team is here to assist you.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 text-center">
                        <i className="fas fa-question-circle text-2xl text-blue-500 mb-2"></i>
                        <h4 className="font-medium mb-1">FAQ</h4>
                        <p className="text-sm text-muted-foreground">Common questions and answers</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 text-center">
                        <i className="fas fa-phone text-2xl text-green-500 mb-2"></i>
                        <h4 className="font-medium mb-1">Call Support</h4>
                        <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4 text-center">
                        <i className="fas fa-envelope text-2xl text-purple-500 mb-2"></i>
                        <h4 className="font-medium mb-1">Email Support</h4>
                        <p className="text-sm text-muted-foreground">support@techparkfood.com</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
