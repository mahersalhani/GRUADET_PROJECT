import Image from "next/image";
import { format } from "date-fns";
import {
  ChevronRightIcon,
  Code2Icon,
  Loader2Icon,
  SendIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg rounded-br-sm bg-muted p-3 shadow-none border border-primary/10 max-w-[80%] break-words hover:border-primary/20">
        {content}
      </Card>
    </div>
  );
}

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
};

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "group/fragment flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-secondary hover:border-primary/40 hover:-translate-y-px hover:shadow-md hover:shadow-primary/10",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary hover:shadow-primary/30",
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-sm">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4 transition-transform duration-200 group-hover/fragment:translate-x-0.5" />
      </div>
    </button>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  onSendErrorToAgent?: () => void;
  isSendingError?: boolean;
  type: MessageType;
};

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  onSendErrorToAgent,
  isSendingError,
  type,
}: AssistantMessageProps) => {
  const isError = type === "ERROR";

  return (
    <div className={cn(
      "flex flex-col group px-2 pb-4",
      isError && "text-destructive",
    )}>
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.png"
          alt="Nexus"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Nexus</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{content}</span>
        {isError && onSendErrorToAgent && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onSendErrorToAgent}
            disabled={isSendingError}
            className="w-fit border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive hover:border-destructive/40"
          >
            {isSendingError ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SendIcon className="size-4" />
            )}
            Let Nexus fix it
          </Button>
        )}
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  )
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  onSendErrorToAgent?: () => void;
  isSendingError?: boolean;
  type: MessageType;
};

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  onSendErrorToAgent,
  isSendingError,
  type,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        onSendErrorToAgent={onSendErrorToAgent}
        isSendingError={isSendingError}
        type={type}
      />
    )
  }

  return (
    <UserMessage content={content} />
  );
};
