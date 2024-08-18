import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/StoreProvider";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/root-components/Navbar";
import { sepolia } from "thirdweb/chains";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZenWallet",
  description: "ZenWallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <StoreProvider>
            <img
              src="/blue.svg"
              alt="Blue"
              className="fixed -top-[50px] -left-[15px] z-[-100] animate-floatUp"
            />
            <img
              src="/green.svg"
              alt="green"
              className="fixed -bottom-[100px] -right-[150px] z-[-100] animate-floatDown"
            />
            <img
              src="/star.svg"
              alt="stars"
              className="fixed bottom-[20px] left-[50px] z-[100] h-52 w-52"
            />
            <img
              src="/star.svg"
              alt="stars"
              className="fixed top-[15px] right-[150px] z-[100] "
            />
            <img
              src="/star.svg"
              alt="stars"
              className="fixed top-[110px] right-[160px] z-[100] h-12 w-12"
            />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="fixed top-0 left-0 w-full h-20">
              <Navbar />
            </div>
            <div className="py-24 px-36 min-h-screen">
              <div className="p-4 border-white/20 border-[1px] shadow-md  min-h-[calc(100vh_-_192px)] bg-[url('/glass.svg')] bg-cover bg-center bg-no-repeat rounded-[20px] backdrop-blur-2xl">
                {children}
              </div>
            </div>
          </StoreProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
