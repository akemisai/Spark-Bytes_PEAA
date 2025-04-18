// layout.tsx
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";;
import Navbar from "./components/Navbar";
import { ClientThemeProvider } from "./components/ClientThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* This part is still server-side */}
        <SessionProvider>
          <Navbar />
          {/* Client-side ThemeProvider and other components wrapped inside ClientThemeProvider */}
          <ClientThemeProvider>{children}</ClientThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
