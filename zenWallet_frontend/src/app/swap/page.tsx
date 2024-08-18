import SwapModal from "@/components/swap-components/swapModal";
import React from "react";

const SwapPage = () => {
  return (
    <div className="min-h-[calc(100vh_-_228px)] w-full flex p-10 justify-between items-center align-middle">
      <div className="absolute bottom-12 left-0">
        <img src="/hero.png" alt="swapHero" className="w-[480px] h-[380px] object-cover" />
      </div>
      <div className="flex justify-center items-end flex-col gap-4 w-full min-h-full p-2">
        <button
          className="text-xl rounded-md px-[20px] py-[10px] w-[150px] text-white"
        >
          Swap
        </button>
      </div>
      <div className="flex justify-center items-center flex-col gap-4 w-full h-full">
        <SwapModal />
      </div>
    </div>
  );
};

export default SwapPage;
