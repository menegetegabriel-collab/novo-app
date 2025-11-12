import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit 30 - 30 Dias para Transformar seu Corpo",
  description: "Treinos em casa sem equipamentos, desafios de 30 dias, progresso diário e planos personalizados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
