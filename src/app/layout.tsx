import { ThemeProvider } from "@/components/theme-provider";
import { WaitForMount } from "@/components/wait-for-mount";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Notables",
  description:
    "Create stylish notes for your apps now. Completely for free, without limits. Start today!",
};

const client = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        <WaitForMount>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <SpeedInsights />
            <QueryClientProvider client={client}>
              {children}
              <Toaster richColors position="top-center" swipeDirections={["top"]} />
            </QueryClientProvider>
          </ThemeProvider>
        </WaitForMount>
      </body>
    </html>
  );
}
