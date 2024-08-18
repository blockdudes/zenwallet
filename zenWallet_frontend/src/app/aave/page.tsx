import BorrowComponent from "@/components/aave-components/borrowComponent";
import LendComponent from "@/components/aave-components/lendComponent";
import UserBorrowed from "@/components/aave-components/userBorrowed";
import UserLended from "@/components/aave-components/userLended";
import React from "react";

const AavePage = () => {
  return (
    <div className="min-h-[calc(100vh_-_228px)] w-full flex flex-col p-2 gap-2">
      <div className="flex flex-1 gap-2">
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-lg p-2">
          <UserLended />
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-lg p-2">
          <UserBorrowed />
        </div>
      </div>
      <div className="flex flex-1 gap-2">
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-lg p-2">
          <LendComponent />
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-lg p-2">
          <BorrowComponent />
        </div>
      </div>
    </div>
  );
};

export default AavePage;