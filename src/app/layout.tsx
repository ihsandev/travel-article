import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import ReactQueryProvider from "@/components/provider/react-query-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Article",
  description: "Travel Article Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
