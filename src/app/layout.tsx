import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema Contable",
  description: "Sistema administrativo contable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "border border-slate-200 bg-white text-slate-900 shadow-lg",
              title: "text-sm font-medium text-slate-900",
              description: "text-sm text-slate-500",
              success:
                "border-slate-200 bg-white text-slate-900",
              error:
                "border-red-200 bg-white text-red-700",
              warning:
                "border-amber-200 bg-white text-amber-700",
              info:
                "border-slate-200 bg-white text-slate-700",
            },
          }}
        />
      </body>
    </html>
  );
}