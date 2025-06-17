import QueryClientContextProvider from "@/components/query-client-context-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WaitForMount } from "@/components/wait-for-mount";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const calSans = localFont({
  src: "./CalSans-SemiBold.woff",
  display: "swap",
  variable: "--font-cal-sans",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${calSans.variable} ${jetbrainsMono.variable} antialiased max-w-screen overflow-x-hidden`}>
        <WaitForMount>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <QueryClientContextProvider>{children}</QueryClientContextProvider>

            <Toaster
              richColors
              position="top-center"
              swipeDirections={["top"]}
            />
            <SpeedInsights />
          </ThemeProvider>
        </WaitForMount>
      </body>
    </html>
  );
}
