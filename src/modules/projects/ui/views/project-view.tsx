"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Suspense, useState } from "react";
import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { FileExplorer } from "@/components/file-explorer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { FragmentWeb } from "../components/fragment-web";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  projectId: string;
};

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary fallback={<p className="p-2 text-sm text-muted-foreground">Couldn&apos;t load the header.</p>}>
            <Suspense fallback={<p className="p-2 text-sm text-muted-foreground animate-pulse">Loading...</p>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<p className="p-2 text-sm text-muted-foreground">Couldn&apos;t load the conversation.</p>}>
            <Suspense fallback={<p className="p-2 text-sm text-muted-foreground animate-pulse">Loading the conversation...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
        >
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="relative w-full flex items-center p-2 border-b">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-[0.15em] pl-1">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="hidden sm:inline">
                  {tabState === "preview" ? "Live preview" : "Source"}
                </span>
              </div>
              <TabsList className="h-8 p-0 border rounded-md absolute left-1/2 -translate-x-1/2">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary">
                    <Link href="/pricing">
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && (
                <FragmentWeb data={activeFragment} projectId={projectId} />
              )}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
