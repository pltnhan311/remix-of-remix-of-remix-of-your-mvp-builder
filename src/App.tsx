import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Combos from "./pages/Combos";
import ComboDetail from "./pages/ComboDetail";
import Auth from "./pages/Auth";
import MyOrders from "./pages/MyOrders";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import OrderList from "./pages/admin/OrderList";
import ComboList from "./pages/admin/ComboList";
import ComboForm from "./pages/admin/ComboForm";
import BannerList from "./pages/admin/BannerList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/san-pham" element={<Products />} />
          <Route path="/san-pham/:slug" element={<ProductDetail />} />
          <Route path="/combo" element={<Combos />} />
          <Route path="/combo/:slug" element={<ComboDetail />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/thanh-toan" element={<Checkout />} />
          <Route path="/dat-hang-thanh-cong/:orderCode" element={<OrderSuccess />} />
          <Route path="/dang-nhap" element={<Auth />} />
          <Route path="/don-hang" element={<MyOrders />} />
          <Route path="/lien-he" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/dang-nhap" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="san-pham" element={<ProductList />} />
            <Route path="san-pham/:id" element={<ProductForm />} />
            <Route path="san-pham/them" element={<ProductForm />} />
            <Route path="combo" element={<ComboList />} />
            <Route path="combo/:id" element={<ComboForm />} />
            <Route path="combo/them" element={<ComboForm />} />
            <Route path="don-hang" element={<OrderList />} />
            <Route path="banner" element={<BannerList />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
