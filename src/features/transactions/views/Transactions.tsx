import { useEffect, useState } from "react";
import { transactionsService } from "../services/transactionsService";
import type { Transaction } from "../types/transaction";

const Transactions = () => {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    transactionsService.getTransactions().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Transactions</h1>

      {data.map((tx) => (
        <div key={tx.id}>
          {tx.id} - {tx.merchant} - {tx.amount}
        </div>
      ))}
    </div>
  );
};

export default Transactions;