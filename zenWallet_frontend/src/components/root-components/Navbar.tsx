"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setPage } from "@/lib/features/pageSelector/pageSelectorSlice";
import { usePathname, useRouter } from "next/navigation"; // Corrected import for useRouter
import { ConnectButton, lightTheme } from "thirdweb/react";
import { client } from "@/lib/client";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const page = useAppSelector((state) => state.pageSelector.value);
  const dispatch = useAppDispatch();

  const handleNavigation = (newPage: string) => {
    dispatch(setPage(newPage)); // Update the page state
    router.push(`/${newPage}`); // Navigate to the new page
  };

  // Determine the active page based on the current route
  const isActive = (pageName: string) => pathname === `/${pageName}`;

  return (
    <div>
      <img
        src="/logoText.svg"
        alt="logo"
        className="fixed top-4 left-5 z-[100] cursor-pointer select-none"
        onClick={() => router.push("/")}
      />
      {pathname === "/" ? (
        <></>
      ) : (
        <div className="fixed z-[100] top-3 right-3">
          <div className="flex justify-center mb-20 ">
            <ConnectButton
              client={client}
              theme={lightTheme({
                colors: {
                  primaryButtonBg: "#ffffff",
                  primaryButtonText: "#000000",
                },
              })}
              connectModal={{ size: "wide" }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-center w-full h-20 space-x-10 ">
        <span
          className={`text-l cursor-pointer select-none ${
            isActive("wallet") ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("wallet")}
        >
          Wallet
        </span>
        <span
          className={`text-l cursor-pointer select-none ${
            isActive("swap") ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("swap")}
        >
          Swap
        </span>
        <span
          className={`text-l cursor-pointer select-none ${
            isActive("aave") ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("aave")}
        >
          Aave
        </span>
        <span
          className={`text-l cursor-pointer select-none ${
            isActive("history") ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("history")}
        >
          History
        </span>
      </div>
    </div>
  );
};

export default Navbar;
