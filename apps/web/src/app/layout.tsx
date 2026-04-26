import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saas-starter-kit.com';

export const metadata: Metadata = {
  title: {
    default: "Enterprise SaaS Starter Kit",
    template: "%s | Enterprise SaaS"
  },
  description: "Robust, performant and multi-tenant SaaS foundation",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Enterprise SaaS Starter Kit",
    description: "The ultimate foundation for your next big idea.",
    url: baseUrl,
    siteName: "Enterprise SaaS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise SaaS Starter Kit",
    description: "Robust, performant and multi-tenant SaaS foundation",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { AuthProvider } from "@/providers/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
