import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "House Of Karma | Backpacker Hostel in Leh, Ladakh",
  description: "A community-focused backpacker hostel in Leh, Ladakh offering comfortable stays, amazing views, and unforgettable experiences.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-emblem.png", type: "image/png" }
    ],
    apple: "/icon.png",
    shortcut: "/icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${plusJakartaSans.variable} bg-off-white text-slate font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
