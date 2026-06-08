import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BugIcon,
  ExternalLinkIcon,
  Loader2Icon,
  RefreshCcwIcon,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Hint } from "@/components/hint";
import { useTRPC } from "@/trpc/client";
import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { getPreviewErrorDiagnostics } from "@/lib/generated-files";

interface Props {
  data: Fragment;
  projectId: string;
};

const buildPreviewErrorMessage = (data: Fragment) => {
  const files = data.files as Record<string, string> | null;
  const diagnostics = getPreviewErrorDiagnostics(files);
  const detectedError = diagnostics.length
    ? diagnostics.join("\n")
    : "The preview is showing a build or runtime error.";

  return [
    "Please fix this preview error and regenerate the app.",
    "",
    "Detected error:",
    detectedError,
    `Preview URL: ${data.sandboxUrl}`,
    "",
    "If a generated file uses React hooks, browser APIs, or event handlers, add \"use client\"; as the first line of that file.",
  ].join("\n");
};

export function FragmentWeb({ data, projectId }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const reportPreviewError = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId }),
        ),
        queryClient.invalidateQueries(
          trpc.usage.status.queryOptions(),
        ),
      ]);
      toast.success("On it — Nexus is fixing the error");
    },
    onError: (error) => {
      toast.error(error.message);

      if (error.data?.code === "TOO_MANY_REQUESTS") {
        router.push("/pricing");
      }
    },
  }));

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const onReportPreviewError = () => {
    reportPreviewError.mutate({
      projectId,
      value: buildPreviewErrorMessage(data),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text="Send the error to Nexus" side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={onReportPreviewError}
            disabled={reportPreviewError.isPending}
          >
            {reportPreviewError.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <BugIcon />
            )}
            <span className="hidden lg:inline">Send error</span>
          </Button>
        </Hint>
        <Hint text="Copy preview URL" side="bottom">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">
              {data.sandboxUrl}
            </span>
          </Button>
        </Hint>
        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  )
};
