"use client";
import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

const TABLE_HEAD = [
  "Type",
  "Amount",
  "Token Address",
  "Sender Address",
  "Receiver Address",
];

const TRANSACTIONS = [
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xYHNO64ieZkgAdG4GeomVD9ikW4MeIZ5nm3qhpcW8",
    tokenAddress: "0xK1lD0tblydag3SMTQ6vPTbvWPESaPsfmz9Pf5SbO",
    amount: 1005,
  },
  {
    senderAddress: "0xxMtbtwbcKtPzjtm50xBwoqm21eQAOrM8gwKCYzox",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0x9V2TV8Fh75lRcTjPno71sxdRKdcknDLtUp9THiWO",
    amount: 146,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xNMajNnUwhGxxT9WA0nSUJQ1JVDgtvRIsOpEwwFBY",
    tokenAddress: "0x9AK5QMvqDVzWwU003fogBKED61yXiGgIa3N1ePk2",
    amount: 552,
  },
  {
    senderAddress: "0xBXK0H4jLIr2dGFGk6qlDIGuwiRNx9HsL5YGZ4Pvm",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xjrKnwtkggCTzHrB10aHdUFs3sLuJXRIrngtkg4bg",
    amount: 963,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xK7XINApSbWlkcHxxAz4xtSqMnNPEcRvejIbW9aln",
    tokenAddress: "0x5ysSUTLg7rn9DdyP4g9dhYNvZEJHB8ABpM0ghVWw",
    amount: 499,
  },
  {
    senderAddress: "0xKZy3i5isFRuF9l5VIoJrXH4OJiOTdGOjVQ2kQeY9",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xxEV3oQKZPf0ufUtmNwZJ5k4HvGACAi7wwOlMnIda",
    amount: 620,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0x8QrikJ8ZEtWqSluB2HpUr4DN219w4xLc27Jnw5WX",
    tokenAddress: "0xcpB6XpgH9Zu5qcHbuvoaj6xZxkxWTIHjJxXQx9RB",
    amount: 969,
  },
  {
    senderAddress: "0xumdmPibh3M5dRSufGXKc6h31CLVxPHPVFlJ5aLQK",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xQGsHjnJ2nFyJbceqecjyAkaD8h3YaPK7IMSOClIq",
    amount: 749,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xhIa663BQ2uKIl4CR99u4pcCLrxgJ2tYApqDqFqSp",
    tokenAddress: "0xh66INWVT4JJx1vkFGNSjczYrbTGoQuEykA7BZMKI",
    amount: 794,
  },
  {
    senderAddress: "0xsBqdIzbjH1LxmA8XDavdMuKr5KwXWphVYotnjdMB",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xjMi8uAJtuTrplQJDSoL1j93FHoVCFcjwDv6swT6v",
    amount: 1040,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xTU64vuiJakwN41A65JlMNemtUNUaW3avfQRfXSxs",
    tokenAddress: "0xCxdqC7Chx0OyCGnuwke4wAOSOBSru519bEDz9EiI",
    amount: 793,
  },
  {
    senderAddress: "0xhFyE0zyUtanNL4MR5QfF01vORmxcgYNwLnJBsC4E",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xAcoHIocs30eC8lJYU7zrhkWef3AeSUNsVO9XU0Gf",
    amount: 282,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xJTD0O6FEvtSdu2EHKKKBRjgkja7Cm2fJrrFEbnrH",
    tokenAddress: "0xm6ncN5D6qgbJEXECDbRLrKijM48q1xVCH2bijqIG",
    amount: 213,
  },
  {
    senderAddress: "0xQSh5bmC9t1Y2AG7Ts7MWvcuRjUdq8fDoCAckNJRX",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xK5VTFAGT8U3mQb2TBnyNN8rQFns69fM9RJ7MdZJJ",
    amount: 308,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xJP7io6Y8hRXr8Ya9rqhRmhDwEreI5c58qOkQVDCR",
    tokenAddress: "0xeQbyg4ekHiLcHe84xvyj70ZLIsRaJahudREyqqyi",
    amount: 1037,
  },
  {
    senderAddress: "0xeO1qm2FPDtadvxO7CSKmaVfBIamwyIqvwWsqeRxb",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xYSTwZDXu3PcRSC6g7WdhA9upyWDYH2xuMVKQnKYO",
    amount: 551,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xVUxytMpTPoUZaJvxxt3jYb9m54jKiJJ0rqw7Qt4N",
    tokenAddress: "0xay3rVOP3gkodJQo6n733Gp1gNgsOReEUMzHNn4CI",
    amount: 612,
  },
  {
    senderAddress: "0xnE1YZk8J5hIImehnFOKT2gIvwF8OujgDYfZglYDC",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xrLfNfe7Yx9p5pSoPxg7KWQlJafbxCZEb3PcJnHIQ",
    amount: 810,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0x6j9Cs7kcKZUoqpzM6jUu2I7FZWRqK4ZaRZERKRI7",
    tokenAddress: "0xGsiiAiHyqWXJyKLp8kT244RS7Q9MHkTLUzUW3tkP",
    amount: 535,
  },
  {
    senderAddress: "0xbNTmDnUbp8cdEJ5eRuHWNiH8BVegDtu4nrWnve93",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xYsdAskfbjbBQHz92Kqp8kasiSQgzUl8OzPfs1cFP",
    amount: 409,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xYcM8uutlcSmkctfftS7Bo3QAGX52lpu3FSoBsEwK",
    tokenAddress: "0xcBZYpJvlqympVbKHPq90htAFFKTADgaB6hutR3uI",
    amount: 484,
  },
  {
    senderAddress: "0xYNtDlXv9n9co3TtOfp1ajW41mQWaFQyuWHxY8z2c",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0x0HOCZcJ696T9vpcJXHMtIaQAcLzER8BLcyuhEmYA",
    amount: 657,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0x83lSMK8x4zwcZxpUlT4PKsJu3YkAggGCfJzankwr",
    tokenAddress: "0xBxbRdhdjTiMEpWYLDRdO4u0M8El1lxyyLFxxVQW9",
    amount: 171,
  },
  {
    senderAddress: "0xmSRnhfFOtrLykM7MO70eMufhBKC0fvdR5HhlR6SR",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xJsRTEXh8KJDAQbmwD2pWlwbn78XzofNo46nmK7y5",
    amount: 303,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xPt9D3L8EDr3H7hctF0MHEmqCeqIECORhsUL5QKfS",
    tokenAddress: "0xW47whalClrbduzEBwEzNN7daNSEHCEElbuFqpKZb",
    amount: 738,
  },
  {
    senderAddress: "0xLVmK5og5M6EJtaxmJ6TCNrcqECfPmm74gJWcsmXB",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xHnIKor5gnX7G9eQ6nelfBUYqsiAYn6VQ0m2i2ojq",
    amount: 345,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0xEoWBzmPP0erCiY7Znznc7VHTvbY7Aq0S4dvyBylv",
    tokenAddress: "0xomj9lRP1IjsCjc6PlmL1MzebPcvyOXxzjQvlzSvr",
    amount: 720,
  },
  {
    senderAddress: "0xwFDXwsu7L4s9sC6oj5cjmwJUDsvXaC0rdTSfmdi7",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xY1D2nPJqXzcvrIlBvjmehQryPYgNd9GQc7y13bp1",
    amount: 565,
  },
  {
    senderAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    receiverAddress: "0x6fIBFO8YpUpQlC9PUI45ztLElkHvUaUGVUuMagbD",
    tokenAddress: "0x7N6dAWkCuhyrGNrE5dzNYPLOzysALiFjiwxwUT0I",
    amount: 703,
  },
  {
    senderAddress: "0x1KkW3b5iEuB4YWfZZBNa9XvPIkqG2eQmAIj2KDmq",
    receiverAddress: "0xF77853fCd30fBd25CD74428B94b691C1704E6cE7",
    tokenAddress: "0xJHu6ZWEFgI4sb9WXyfbgoplcDJNw4xxD4OklkRII",
    amount: 442,
  },
];

const truncateAddress = (address: string) => {
  return `${address.slice(0, 10)}...${address.slice(-4)}`;
};

const HistoryTable = () => {
  const activeAccount = useActiveAccount();

  const [address, setAddress] = useState(activeAccount?.address);

  const userAddress = address; // Replace this with the actual user address.

  return (
    <div className="relative sm:rounded-lg min-h-[460px]">
      <div className="text-sm text-left text-gray-300">
        {/* Static header */}
        <div className="text-xs uppercase bg-white/20 sticky top-0 z-10 rounded-t-lg backdrop-blur-md">
          <table className="w-full">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="py-4 px-6">
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
              {TRANSACTIONS.map((transaction, index) => {
                const transactionType =
                  transaction.senderAddress === userAddress
                    ? "Send"
                    : transaction.receiverAddress === userAddress
                    ? "Receive"
                    : "Unknown";

                // Determine the className based on transaction type
                const colorClass =
                  transactionType === "Send"
                    ? "text-yellow-500" // Red for send
                    : transactionType === "Receive"
                    ? "text-white" // Green for receive
                    : "text-gray-500"; // Gray for unknown

                return (
                  <tr key={index}>
                    <td className={`py-4 px-6 ${colorClass}`}>
                      {transactionType}
                    </td>
                    <td className="py-4 px-6">{transaction.amount}</td>
                    <td className="py-4 px-6">
                      {truncateAddress(transaction.tokenAddress)}
                    </td>
                    <td className="py-4 px-6">
                      {truncateAddress(transaction.senderAddress)}
                    </td>
                    <td className="py-4 px-6">
                      {truncateAddress(transaction.receiverAddress)}
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
