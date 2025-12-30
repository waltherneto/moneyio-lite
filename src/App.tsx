// [MONEYIO-APP-002]
import { useEffect } from "react";
import { useTransactionsStore } from "./modules/transactions/transactions.store";
import { DashboardPage } from "./modules/transactions/pages/DashboardPage";

function App() {
  const hydrate = useTransactionsStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <DashboardPage />
    </main>
  );
}

export default App;
