import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "NextBlog - Modern Web Development",
  description: "A blog about web development, design, and technology.",
};

import StoreProvider from "./StoreProvider";
import { Toaster } from 'react-hot-toast';

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lato.variable} antialiased flex flex-col min-h-screen`}
      >
        <StoreProvider>
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        </StoreProvider>
      </body>
    </html>
  );
}
