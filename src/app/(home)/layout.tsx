import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return ( 
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-20 h-full w-full bg-background dark:bg-[radial-gradient(#2c3a63_1px,transparent_1px)] bg-[radial-gradient(#c3d0ee_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] w-full" />
      <div className="flex-1 flex flex-col px-4 pb-4">
        {children}
      </div>
    </main>
  );
};
 
export default Layout;
