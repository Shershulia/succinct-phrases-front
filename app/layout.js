  import { Geist, Geist_Mono } from "next/font/google";
  import "./globals.css";
  import { Toaster } from 'react-hot-toast';
  import localFont from 'next/font/local';

  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });

  const myFont = localFont({
    src: './fonts/rmegg.ttf',
    variable: '--font-my',
    display: 'swap',
    displayName: 'rmegg'
  });
  const ivoryFont = localFont({
    src: './fonts/ivory.ttf',
    variable: '--font-ivory',
    display: 'swap',
    displayName: 'ivory'
  });
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });

  export const metadata = {
    title: "Succinct Golden Phrases",
    description: "Succinct Golden Phrases",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${myFont.variable} ${ivoryFont.variable} antialiased`}
        >
          <Toaster position="top-center" />
          {children}
          
        </body>
      </html>
    );
  }
