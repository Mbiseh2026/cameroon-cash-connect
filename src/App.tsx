import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Deposit from "./pages/Deposit";
import GoalSavings from "./pages/GoalSavings";
import SaveMoney from "./pages/SaveMoney";
import SendMoney from "./pages/SendMoney";
import Withdraw from "./pages/Withdraw";
import BusinessLoan from "./pages/BusinessLoan";
import PaySchoolFees from "./pages/PaySchoolFees";
import PayRent from "./pages/PayRent";
import Loans from "./pages/Loans";
import TFunds from "./pages/TFunds";
import History from "./pages/History";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import Insurance from "./pages/Insurance";
import BookLessons from "./pages/BookLessons";
import Attendance from "./pages/Attendance";
import GetPaid from "./pages/GetPaid";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Index />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/save" element={<SaveMoney />} />
          <Route path="/goals" element={<GoalSavings />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/lessons" element={<BookLessons />} />
          <Route path="/pay-fees" element={<PaySchoolFees />} />
          <Route path="/pay-rent" element={<PayRent />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/business-loan" element={<BusinessLoan />} />
          <Route path="/tfunds" element={<TFunds />} />
          <Route path="/history" element={<History />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/get-paid" element={<GetPaid />} />
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
