import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "CapstoneConnect — Indian College Capstone & Research Collaborator Platform",
  description:
    "Connect with ambitious engineering students, assemble high-impact capstone project teams, and recruit talent across Indian colleges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FBFBF9] text-[#181C1B]">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
