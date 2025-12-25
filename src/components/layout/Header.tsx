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
    { href: "/lien-he", label: "Liên hệ" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar - Cranberry Red */}
      <div className="bg-cranberry text-white py-2 text-center text-sm font-medium">
        <p>🎄 Miễn phí vận chuyển cho đơn hàng từ 500.000₫ | Hotline: 0909 123 456</p>
      </div>

      {/* Main header - Minimal with soft shadow */}
      <div className="bg-white shadow-soft-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-warm-100">
                  <Menu className="h-6 w-6 text-warm-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white">
                <div className="flex flex-col gap-6 mt-8">
                  <Link to="/" className="flex items-center gap-3">
                    <span className="text-3xl">🎄</span>
                    <span className="font-semibold text-2xl text-cranberry">Noel Shop</span>
                  </Link>
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="py-3 px-4 rounded-md text-warm-600 hover:bg-warm-100 hover:text-cranberry transition-all duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t border-warm-200 pt-6 mt-2 space-y-1">
                    {isLoggedIn ? (
                      <>
                        <Link to="/don-hang" className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-warm-100 text-warm-600">
                          <Package className="h-5 w-5" />
                          Đơn hàng của tôi
                        </Link>
                        <button
                          onClick={() => { authService.logout(); window.location.reload(); }}
                          className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-warm-100 w-full text-left text-warm-600"
                        >
                          <LogOut className="h-5 w-5" />
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <Link to="/dang-nhap" className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-warm-100 text-warm-600">
                        <User className="h-5 w-5" />
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover-lift">
              <span className="text-3xl">🎄</span>
              <div className="hidden sm:block">
                <span className="font-semibold text-2xl text-cranberry">Noel Shop</span>
                <span className="block text-xs text-warm-400 -mt-0.5">Premium Christmas Decor</span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-medium text-warm-500 hover:text-cranberry transition-all duration-200 relative group py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cranberry transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="hidden md:flex items-center">
                {isSearchOpen ? (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <Input
                      placeholder="Tìm sản phẩm..."
                      className="w-52 border-warm-200 focus:border-cranberry focus:ring-cranberry/20"
                      autoFocus
                      onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearchOpen(false)}
                      className="hover:bg-warm-100"
                    >
                      <X className="h-5 w-5 text-warm-500" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="hover:bg-warm-100"
                  >
                    <Search className="h-5 w-5 text-warm-500" />
                  </Button>
                )}
              </div>

              {/* Mobile search */}
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-warm-100">
                <Search className="h-5 w-5 text-warm-500" />
              </Button>

              {/* Account */}
              <Link to={isLoggedIn ? "/don-hang" : "/dang-nhap"}>
                <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-warm-100">
                  <User className="h-5 w-5 text-warm-500" />
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/gio-hang">
                <Button variant="ghost" size="icon" className="relative hover:bg-warm-100">
                  <ShoppingCart className="h-5 w-5 text-warm-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cranberry text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-soft-sm animate-scale-in">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

