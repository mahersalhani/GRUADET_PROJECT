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
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <h2 className="text-2xl font-semibold">
        {user?.firstName}&apos;s Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-sm text-muted-foreground">
              No projects found
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
                  src="/logo.svg"
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
