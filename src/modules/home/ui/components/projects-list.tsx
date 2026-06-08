"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { ArrowRightIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

  if (!user) return null;

  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-5">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {user?.firstName}&apos;s Projects
        </h2>
        {!!projects?.length && (
          <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold border border-primary/20">
            {projects.length}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
              <ArrowRightIcon className="size-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Nothing here yet</p>
            <p className="text-xs text-muted-foreground">
              Type an idea above and ship your first app
            </p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className="group/card font-normal h-auto justify-start w-full text-start p-4 overflow-hidden"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4 w-full">
                <Image
                  src="/logo.png"
                  alt="Nexus"
                  width={32}
                  height={32}
                  className="object-contain transition-transform duration-300 group-hover/card:rotate-[18deg] group-hover/card:scale-110"
                />
                <div className="flex flex-col min-w-0">
                  <h3 className="truncate font-medium transition-colors group-hover/card:text-primary">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <ArrowRightIcon className="ml-auto size-4 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-x-0" />
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
