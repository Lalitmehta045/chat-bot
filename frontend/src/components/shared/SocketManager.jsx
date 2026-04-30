import { useEffect } from 'react';
import { useChatStore } from '@store/useChatStore';
import { useAuthStore } from '@store/useAuthStore';
import { getSocket } from '@lib/socket';

export const SocketManager = () => {
  const { authUser } = useAuthStore();
  const { 
    addMessage, 
    setOnlineUsers, 
    addOnlineUser, 
    removeOnlineUser, 
    setTyping, 
    applyReactionUpdate,
    updateMessage
  } = useChatStore();

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !authUser) return;

    // Online status events
    const handleOnlineUsers = (users) => {
      console.log('Online users list received:', users);
      setOnlineUsers(users);
    };

    const handleUserOnline = (userId) => {
      console.log('User online:', userId);
      addOnlineUser(userId);
    };

    const handleUserOffline = (userId) => {
      console.log('User offline:', userId);
      removeOnlineUser(userId);
    };

    // Typing events
    const handleTypingStart = ({ conversationId, userId }) => {
      setTyping(conversationId, userId, true);
    };

    const handleTypingStop = ({ conversationId, userId }) => {
      setTyping(conversationId, userId, false);
    };

    // Message events
    const handleNewMessage = (data) => {
      const message = data?.message || data;
      addMessage(message);
    };

    const handleMessageSeen = (data) => {
      updateMessage(data.messageId, {
        readBy: data.readBy || [],
        isRead: data.isRead
      });
    };

    // Reaction events
    const handleReactionUpdated = (payload) => {
      applyReactionUpdate(payload);
    };

    // Register listeners
    socket.on('online_users', handleOnlineUsers);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('user_typing', handleTypingStart);
    socket.on('user_stop_typing', handleTypingStop);
    socket.on('new_message', handleNewMessage);
    socket.on('message_seen', handleMessageSeen);
    socket.on('reaction_updated', handleReactionUpdated);

    // Request initial online users
    socket.emit('get_online_users');

    return () => {
      socket.off('online_users', handleOnlineUsers);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('user_typing', handleTypingStart);
      socket.off('user_stop_typing', handleTypingStop);
      socket.off('new_message', handleNewMessage);
      socket.off('message_seen', handleMessageSeen);
      socket.off('reaction_updated', handleReactionUpdated);
    };
  }, [
    authUser, 
    addMessage, 
    setOnlineUsers, 
    addOnlineUser, 
    removeOnlineUser, 
    setTyping, 
    applyReactionUpdate, 
    updateMessage
  ]);

  return null; // This component doesn't render anything
};
