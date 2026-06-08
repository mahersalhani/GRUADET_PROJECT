import Image from "next/image";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="reveal flex flex-col items-center" style={{ animationDelay: "0ms" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium font-mono uppercase tracking-[0.18em] text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            AI app builder
          </span>
        </div>
        <div className="reveal flex flex-col items-center" style={{ animationDelay: "80ms" }}>
          <Image
            src="/logo.svg"
            alt="Nexus"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1
          className="reveal font-display text-4xl md:text-6xl font-extrabold text-center tracking-tight"
          style={{ animationDelay: "140ms" }}
        >
          Build something with{" "}
          <span className="text-gradient-blue">Nexus</span>
        </h1>
        <p
          className="reveal text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto"
          style={{ animationDelay: "220ms" }}
        >
          Describe the app you imagine and watch AI agents design, write, and
          run it — live, in seconds.
        </p>
        <div
          className="reveal max-w-3xl mx-auto w-full"
          style={{ animationDelay: "300ms" }}
        >
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
};
 
export default Page;
