import { Sora, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Gopo",
  description: "AI event photo matching platform",
  icons: {
    icon: "/G.png",
    shortcut: "/G.png",
    apple: "/G.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
