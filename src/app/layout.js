import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { DynamicTitle } from "@/components/DynamicTitle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: 'Spotify Clone - Listen to Music',
  description: 'A Spotify clone application where you can listen to your favorite music and discover new tracks.',
  icons: {
    icon: '/spotify.png',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DynamicTitle />
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
