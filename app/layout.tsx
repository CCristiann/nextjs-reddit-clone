import Navbar from "@/components/navbar/Navbar";
import "../styles/global.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";
import Providers from "@/components/providers/Providers";

import { cn } from "@/libs/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import RedditMan from "@/components/RedditMan";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reddit clone",
  description: "Reddit clone made with NextJS 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          termsPageUrl: "https://clerk.com/terms",
        },
        elements: {
          formFieldInput: "rounded-md text-zinc-900 text-sm",
          formFieldInputShowPasswordButton: "text-zinc-900 hover:text-zinc-900",
          otpCodeFieldInput: "rounded-md text-zinc-900",
        },
      }}
    >
      <html
        lang="en"
        className={cn("antialiased", inter.className)}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-slate-200 antialiased dark:bg-black">
          <RedditMan />
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              storageKey="reddit-theme"
            >
              <Navbar />
              <main>{children}</main>
            </ThemeProvider>
          </Providers>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: "",
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },

              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#1D9BF0",
                  secondary: "#FFFFFF",
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
