import { Indicator } from "@/components/indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import localFont from "next/font/local";
import "react-data-grid/lib/styles.css";

const fontSans = localFont({
  src: "../../assets/fonts/Inter.var.woff2",
  preload: true,
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../../assets/fonts/CalSans-SemiBold.woff2",
  preload: true,
  variable: "--font-heading",
});

const fontMono = localFont({
  src: "../../assets/fonts/Jack-Regular.woff2",
  preload: true,
  variable: "--font-mono",
});

const fontLogo = localFont({
  src: "../../assets/fonts/JeeWish.woff2",
  preload: true,
  variable: "--font-logo",
});

export const metadata = {
  title: "Probiotics",
  description: "Probiotics",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
          fontHeading.variable,
          fontLogo.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Indicator />
      </body>
    </html>
  );
}
