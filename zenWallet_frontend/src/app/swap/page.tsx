import SwapModal from "@/components/swap-components/swapModal";
import React from "react";

const SwapPage = () => {
  return (
    <div className="min-h-[calc(100vh_-_228px)] w-full flex p-10 justify-between items-center align-middle">
      <div className="flex justify-center items-center flex-col gap-4 w-full min-h-full">
        <button
          className="backdrop-blur-md rounded-md px-[20px] py-[10px] w-[200px] text-white"
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
