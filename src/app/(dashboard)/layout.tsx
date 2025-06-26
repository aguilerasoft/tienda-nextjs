// components/Layout.tsx
import { ReactNode } from "react";
import WavySidebar from "@/components/app-sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <WavySidebar />
      <main className="flex-1 ml-0 lg:ml-72 pt-16 transition-all duration-300">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}