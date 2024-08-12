"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setPage } from "@/lib/features/pageSelector/pageSelectorSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const page = useAppSelector((state) => state.pageSelector.value);
  const dispatch = useAppDispatch();

  const handleNavigation = (newPage: string) => {
    dispatch(setPage(newPage)); // Update the page state
    router.push(`/${newPage}`); // Navigate to the new page
  };

  return (
    <>
      <img
        src="/logoText.svg"
        alt="logo"
        className="fixed top-4 left-5 z-[100] cursor-pointer"
        onClick={() => router.push("/")}
      />
      <div className="flex items-center justify-center w-full h-20 space-x-10">
        <span
          className={`text-l  ${
            page === "wallet" ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("wallet")}
        >
          Wallet
        </span>
        <span
          className={`text-l  ${
            page === "swap" ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("swap")}
        >
          Swap
        </span>
        <span
          className={`text-l ${
            page === "aave" ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("aave")}
        >
          Aave
        </span>
        <span
          className={`text-l ${
            page === "history" ? "text-yellow-500" : "text-white"
          }`}
          onClick={() => handleNavigation("history")}
        >
          History
        </span>
      </div>
    </>
  );
};

export default Navbar;
