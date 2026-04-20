import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAInstall } from "@/components/PWAInstall";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Claw Fleet AI Agent Dashboard",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mission Control",
  },
  icons: {
    apple: "/icon-192.png",
    icon: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5e6ad2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mission Control" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body><PWAInstall />{children}</body>
    </html>
  );
}
