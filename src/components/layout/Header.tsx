import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cartService, authService } from "@/services";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = cartService.getItemCount();
  const user = authService.getCurrentUser();
  const isLoggedIn = authService.isAuthenticated();

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/san-pham", label: "Sản phẩm" },
    { href: "/combo", label: "Combo" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1.5 text-center text-sm">
        <p>🎄 Miễn phí vận chuyển đơn từ 500K | Hotline: 0909 123 456</p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-xl font-bold text-primary">
                  🎄 Noel Shop
                </Link>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t pt-4 mt-4 space-y-1">
                  {isLoggedIn ? (
                    <>
                      <Link to="/don-hang" className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary">
                        <Package className="h-5 w-5" />
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={() => { authService.logout(); window.location.reload(); }}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link to="/dang-nhap" className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary">
                      <User className="h-5 w-5" />
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎄</span>
            <span className="font-bold text-xl text-primary hidden sm:block">
              Noel Shop
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <Input
                    placeholder="Tìm sản phẩm..."
                    className="w-48"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Account */}
            <Link to={isLoggedIn ? "/don-hang" : "/dang-nhap"}>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/gio-hang">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
