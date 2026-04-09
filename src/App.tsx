import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Deposit from "./pages/Deposit";
import GoalSavings from "./pages/GoalSavings";
import SendMoney from "./pages/SendMoney";
import Withdraw from "./pages/Withdraw";
import BusinessLoan from "./pages/BusinessLoan";
import TFunds from "./pages/TFunds";
import History from "./pages/History";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/goals" element={<GoalSavings />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/loans" element={<BusinessLoan />} />
          <Route path="/tfunds" element={<TFunds />} />
          <Route path="/history" element={<History />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
