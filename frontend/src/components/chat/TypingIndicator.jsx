import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useChatStore } from '@store/useChatStore';
import { useAuthStore } from '@store/useAuthStore';

const dotTransition = (delay) => ({
  duration: 1.05,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop',
  delay,
});

export const TypingIndicator = memo(({ conversationId }) => {
  const { typingUsers, conversations } = useChatStore(
    useShallow((state) => ({
      typingUsers: state.typingUsers,
      conversations: state.conversations,
    }))
  );
  const { authUser } = useAuthStore();

  const typingUserId = typingUsers[conversationId];
  if (!typingUserId || typingUserId === authUser?._id) return null;

  const conversation = conversations.find((item) => item._id === conversationId);
  const typingUser = conversation?.participants?.find((participant) => participant._id === typingUserId);

  if (!typingUser) return null;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none w-full px-3 pb-3 sm:px-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3.5 py-2 shadow-xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-2 w-2 rounded-full bg-violet-300"
                animate={{
                  opacity: [0.35, 1, 0.35],
                  y: [0, -2, 0],
                  scale: [0.9, 1.08, 0.9],
                }}
                transition={dotTransition(index * 0.12)}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {typingUser.username} is typing
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
