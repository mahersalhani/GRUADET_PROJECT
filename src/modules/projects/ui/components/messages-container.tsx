import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Fragment } from "@/generated/prisma";

import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
};

export const MessagesContainer = ({ 
  projectId,
  activeFragment,
  setActiveFragment
}: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const [sendingErrorMessageId, setSendingErrorMessageId] = useState<string | null>(null);

  const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
    projectId: projectId,
  }, {
    refetchInterval: 2000,
  }));

  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId }),
        ),
        queryClient.invalidateQueries(
          trpc.usage.status.queryOptions(),
        ),
      ]);
      toast.success("Sent to Nexus — fixing it now");
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "TOO_MANY_REQUESTS") {
        router.push("/pricing");
      }
    },
    onSettled: () => {
      setSendingErrorMessageId(null);
    },
  }));

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  const sendErrorToAgent = (messageId: string, content: string) => {
    const prefix = "Please fix this error and regenerate the app:\n\n";
    const maxContentLength = 10000 - prefix.length;
    const errorContent =
      content.length > maxContentLength
        ? `${content.slice(0, maxContentLength - 20)}\n\n[error truncated]`
        : content;

    setSendingErrorMessageId(messageId);
    createMessage.mutate({
      projectId,
      value: `${prefix}${errorContent}`,
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => setActiveFragment(message.fragment)}
              onSendErrorToAgent={
                message.type === "ERROR"
                  ? () => sendErrorToAgent(message.id, message.content)
                  : undefined
              }
              isSendingError={
                sendingErrorMessageId === message.id && createMessage.isPending
              }
              type={message.type}
            />
          ))}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
