import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
}

const Chat: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'AJ',
      lastMessage: 'Hey, how are you doing?',
      timestamp: '2m ago',
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'BS',
      lastMessage: 'Did you see the latest update?',
      timestamp: '15m ago',
      unreadCount: 0,
      online: true,
    },
    {
      id: '3',
      name: 'Carol Williams',
      avatar: 'CW',
      lastMessage: 'Thanks for your help!',
      timestamp: '1h ago',
      unreadCount: 5,
      online: false,
    },
    {
      id: '4',
      name: 'David Brown',
      avatar: 'DB',
      lastMessage: 'Let\'s schedule a meeting',
      timestamp: '3h ago',
      unreadCount: 0,
      online: false,
    },
    {
      id: '5',
      name: 'Emma Davis',
      avatar: 'ED',
      lastMessage: 'Great work on the project!',
      timestamp: '1d ago',
      unreadCount: 1,
      online: true,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hey! How\'s the project going?',
      sender: 'contact',
      timestamp: '10:30 AM',
      read: true,
    },
    {
      id: '2',
      text: 'It\'s going really well! Just finished the main features.',
      sender: 'user',
      timestamp: '10:32 AM',
      read: true,
    },
    {
      id: '3',
      text: 'That\'s awesome! Can you show me a demo?',
      sender: 'contact',
      timestamp: '10:33 AM',
      read: true,
    },
    {
      id: '4',
      text: 'Sure! I\'ll prepare something for tomorrow.',
      sender: 'user',
      timestamp: '10:35 AM',
      read: true,
    },
    {
      id: '5',
      text: 'Perfect! Looking forward to it.',
      sender: 'contact',
      timestamp: '10:36 AM',
      read: true,
    },
    {
      id: '6',
      text: 'Hey, how are you doing?',
      sender: 'contact',
      timestamp: '2m ago',
      read: false,
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
                selectedConversation === conversation.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar with Online Indicator */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#2dd4bf] flex items-center justify-center font-semibold">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-[#2dd4bf] text-[#1a1a1a] text-xs font-bold px-2 py-0.5 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#2dd4bf] flex items-center justify-center font-semibold">
                    {selectedConv.avatar}
                  </div>
                  {selectedConv.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedConv.name}</h2>
                  <p className="text-xs text-gray-400">
                    {selectedConv.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Phone size={20} className="text-[#2dd4bf]" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Video size={20} className="text-[#2dd4bf]" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-[#2dd4bf] text-[#1a1a1a]'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span
                        className={`text-xs ${
                          message.sender === 'user' ? 'text-[#1a1a1a]/70' : 'text-gray-400'
                        }`}
                      >
                        {message.timestamp}
                      </span>
                      {message.sender === 'user' && (
                        <>
                          {message.read ? (
                            <CheckCheck size={14} className="text-[#1a1a1a]/70" />
                          ) : (
                            <Check size={14} className="text-[#1a1a1a]/70" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors mb-1">
                  <Paperclip size={20} className="text-gray-400" />
                </button>
                
                <div className="flex-1 bg-gray-800 rounded-lg flex items-end">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none resize-none max-h-32"
                  />
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors mr-1 mb-1">
                    <Smile size={20} className="text-gray-400" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 rounded-lg transition-colors mb-1"
                >
                  <Send size={20} className="text-[#1a1a1a]" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
