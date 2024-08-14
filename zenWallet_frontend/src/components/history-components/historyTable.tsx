"use client";
import React, { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

const TABLE_HEAD = [
  "Type",
  "Amount",
  "Token Address",
  "Sender Address",
  "Receiver Address",
];

const truncateAddress = (address: string) => {
  return `${address.slice(0, 10)}...${address.slice(-4)}`;
};

interface Transaction {
  TYPE: string;
  AMOUNT: number;
  TOKEN_ADDRESS: string;
  SENDER_ADDRESS: string;
  RECEIVER_ADDRESS: string;
}

const HistoryTable = () => {
  const activeAccount = useActiveAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Function to fetch transactions from localStorage
    const fetchTransactions = () => {
      const storedTransactions = localStorage.getItem("transactionData");
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    };

    fetchTransactions();

    // Optional: Set up an interval to refresh data periodically
    const interval = setInterval(fetchTransactions, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative sm:rounded-lg min-h-[460px]">
      <div className="text-sm text-left text-gray-300">
        {/* Static header */}
        <div className="text-xs uppercase bg-white/20 sticky top-0 z-10 rounded-t-lg backdrop-blur-md justify-center">
          <table className="w-full">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="py-4 px-6 ">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        {/* Scrollable body */}
        <div className="overflow-auto max-h-[470px] min-h-[460px] rounded-b-lg bg-white/10 backdrop-blur-md">
          <table className="w-full">
            <tbody className="bg-transparent">
              {transactions.map((transaction, index) => {
                let colorClass;
                switch (transaction.TYPE) {
                  case "send":
                    colorClass = "text-yellow-500";
                    break;
                  case "swap":
                    colorClass = "text-green-500";
                    break;
                  case "aave.borrow":
                  case "aave.repay":
                  case "aave.lend":
                  case "aave.withdraw":
                    colorClass = "text-blue-500";
                    break;
                  default:
                    colorClass = "text-gray-500";
                    break;
                }

                return (
                  <tr key={index}>
                    <td className={`py-4 px-6  ${colorClass}`}>
                      {transaction.TYPE}
                    </td>
                    <td className="py-4 px-6">{transaction.AMOUNT}</td>
                    <td className="py-4 px-6">
                      {truncateAddress(transaction.TOKEN_ADDRESS)}
                    </td>
                    <td className="py-4 px-6">
                      {truncateAddress(transaction.SENDER_ADDRESS)}
                    </td>
                    <td className="py-4 px-6">
                      {truncateAddress(transaction.RECEIVER_ADDRESS)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;