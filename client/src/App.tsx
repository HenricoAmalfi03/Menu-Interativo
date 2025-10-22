import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";

// Client Pages
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";

// Admin Pages
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import WaitersPage from "@/pages/admin/WaitersPage";
import OrdersPage from "@/pages/admin/OrdersPage";

function Router() {
  return (
    <Switch>
      {/* Client Routes */}
      <Route path="/" component={MenuPage} />
      <Route path="/checkout" component={CheckoutPage} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={LoginPage} />
      <Route path="/admin/dashboard" component={DashboardPage} />
      <Route path="/admin/categories" component={CategoriesPage} />
      <Route path="/admin/products" component={ProductsPage} />
      <Route path="/admin/waiters" component={WaitersPage} />
      <Route path="/admin/orders" component={OrdersPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
