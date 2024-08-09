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
    <div className="flex items-center justify-center w-full h-20 space-x-10">
      <span
        className={`text-xl font-bold ${
          page === "wallet" ? "text-yellow-500" : "text-white"
        }`}
        onClick={() => handleNavigation("wallet")}
      >
        Wallet
      </span>
      <span
        className={`text-xl font-bold ${
          page === "swap" ? "text-yellow-500" : "text-white"
        }`}
        onClick={() => handleNavigation("swap")}
      >
        Swap
      </span>
      <span
        className={`text-xl font-bold ${
          page === "aave" ? "text-yellow-500" : "text-white"
        }`}
        onClick={() => handleNavigation("aave")}
      >
        Aave
      </span>
    </div>
  );
};

export default Navbar;
