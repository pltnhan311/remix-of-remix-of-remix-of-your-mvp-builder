import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Search, User, LogOut, Package } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-warmGray-200 shadow-soft transition-smooth">
      {/* Top bar - Refined burgundy */}
      <div className="bg-christmas-burgundy text-white py-2 text-center text-sm font-medium">
        <p className="container mx-auto px-4">
          <span className="hidden sm:inline">🎄 </span>
          Miễn phí vận chuyển cho đơn hàng từ 500.000₫
          <span className="hidden md:inline"> | Hotline: 0909 123 456</span>
        </p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-warmGray-100">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 animate-slide-in-left">
              <div className="flex flex-col gap-6 mt-8">
                <Link to="/" className="flex items-center gap-2">
                  <span className="text-3xl">🎄</span>
                  <span className="font-serif font-bold text-2xl text-christmas-burgundy">
                    Noel Shop
                  </span>
                </Link>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="py-3 px-4 rounded-lg hover:bg-warmGray-100 transition-smooth font-medium text-foreground hover:text-christmas-burgundy"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-warmGray-200 pt-4 space-y-1">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/don-hang"
                        className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-warmGray-100 transition-smooth"
                      >
                        <Package className="h-5 w-5 text-christmas-sage" />
                        <span className="font-medium">Đơn hàng của tôi</span>
                      </Link>
                      <button
                        onClick={() => { authService.logout(); window.location.reload(); }}
                        className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-warmGray-100 transition-smooth w-full text-left"
                      >
                        <LogOut className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/dang-nhap"
                      className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-warmGray-100 transition-smooth"
                    >
                      <User className="h-5 w-5 text-christmas-sage" />
                      <span className="font-medium">Đăng nhập</span>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Elegant typography */}
          <Link to="/" className="flex items-center gap-3 hover-lift">
            <span className="text-3xl">🎄</span>
            <div className="hidden sm:block">
              <span className="font-serif font-bold text-2xl text-christmas-burgundy block leading-none">
                Noel Shop
              </span>
              <span className="font-handwritten text-sm text-christmas-sage">
                Christmas Decorations
              </span>
            </div>
          </Link>

          {/* Desktop navigation - Clean spacing */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-medium text-foreground/80 hover:text-christmas-burgundy transition-smooth relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-christmas-burgundy transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions - Refined icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm sản phẩm..."
                      className="w-56 pl-10 border-warmGray-300 focus:border-christmas-burgundy"
                      autoFocus
                      onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-warmGray-100"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-warmGray-100"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Account */}
            <Link to={isLoggedIn ? "/don-hang" : "/dang-nhap"}>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-warmGray-100"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart - Enhanced badge */}
            <Link to="/gio-hang">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-warmGray-100 hover-lift"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-christmas-burgundy text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-soft animate-scale-in">
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
