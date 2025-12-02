import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/contexts/ConfigContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Painel de Seguros – Via Direta",
  description: "Gestão de Consultores, Novos Seguros e Renovações",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}