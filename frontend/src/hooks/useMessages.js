import { useCallback, useEffect } from 'react';
import { useChatStore } from '@store/useChatStore';
import { getSocket, emitMessageRead } from '@lib/socket';

export const useMessages = (conversationId) => {
  const {
    messages,
    getMessages,
    addMessage,
    setTyping,
    hasMoreMessages,
    isLoadingMessages,
  } = useChatStore();

  const conversationMessages = messages.filter(
    (m) => (m.conversation || m.conversationId) === conversationId
  );

  const loadMore = useCallback(() => {
    if (hasMoreMessages && !isLoadingMessages) {
      const currentPage = Math.ceil(conversationMessages.length / 20) + 1;
      getMessages(conversationId, currentPage);
    }
  }, [conversationId, hasMoreMessages, isLoadingMessages, conversationMessages.length, getMessages]);

  const markAsRead = useCallback((messageId) => {
    emitMessageRead(messageId, conversationId);
  }, [conversationId]);

  // No longer needed here as SocketManager handles global message events
  // but we keep the hook for local message filtering and loading logic
  
  return {
    messages: conversationMessages,
    loadMore,
    markAsRead,
    hasMore: hasMoreMessages,
    isLoading: isLoadingMessages,
  };
};
