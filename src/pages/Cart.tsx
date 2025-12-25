import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cartService } from "@/services";
import { formatPrice } from "@/lib/format";
import { CartItem } from "@/types";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [, forceUpdate] = useState(0);

  const cart = cartService.getCart();
  const items = cart.items;
  const subtotal = cartService.getSubtotal();
  const shippingFee = cartService.getShippingFee();
  const total = cartService.getTotal();

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    const result = cartService.updateQuantity(item.productId, item.variantId, newQuantity);
    if (result.success) {
      forceUpdate(n => n + 1);
    } else {
      toast({
        title: "Không thể cập nhật",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    cartService.removeItem(item.productId, item.variantId, item.comboId);
    forceUpdate(n => n + 1);
    toast({
      title: "Đã xóa khỏi giỏ hàng",
      description: item.name,
    });
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="bg-warmGray-50 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto bg-card rounded-xl p-8 border border-warmGray-200 shadow-soft">
              <div className="text-8xl mb-6 animate-bounce-soft">🛒</div>
              <h1 className="font-serif text-3xl font-bold mb-4 text-foreground">Giỏ hàng trống</h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Hãy khám phá các sản phẩm trang trí Giáng Sinh tuyệt vời của chúng tôi!
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/san-pham")}
                className="bg-christmas-burgundy hover:bg-christmas-burgundy/90 hover-lift px-8"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Mua sắm ngay
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-warmGray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-christmas-burgundy transition-smooth">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Giỏ hàng</span>
          </nav>

          <h1 className="font-serif text-4xl font-bold mb-2 text-christmas-burgundy">Giỏ hàng của bạn</h1>
          <p className="text-muted-foreground mb-8">{items.length} sản phẩm</p>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.variantId || ''}-${index}`}
                  className="flex gap-4 p-5 bg-card rounded-xl border border-warmGray-200 shadow-soft hover-lift transition-smooth"
                >
                  {/* Image */}
                  <Link to={`/san-pham/${item.productId}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-warmGray-100 image-zoom-container">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="image-zoom w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/san-pham/${item.productId}`}
                      className="font-semibold hover:text-christmas-burgundy line-clamp-2 transition-smooth"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Phân loại: {item.variantName}
                      </p>
                    )}
                    <p className="font-bold text-christmas-burgundy mt-2 text-lg">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 border border-warmGray-300 rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-warmGray-100"
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-warmGray-100"
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-smooth"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>

                  {/* Item Total (Desktop) */}
                  <div className="hidden sm:block text-right">
                    <p className="font-bold text-lg text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-card rounded-xl border border-warmGray-200 p-6 sticky top-24 shadow-soft">
                <h2 className="font-serif font-bold text-2xl mb-6 text-foreground">Tổng đơn hàng</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-christmas-sage font-semibold">Miễn phí</span>
                      ) : (
                        <span className="font-medium">{formatPrice(shippingFee)}</span>
                      )}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground bg-warmGray-100 p-3 rounded-lg">
                      💡 Miễn phí vận chuyển cho đơn từ {formatPrice(500000)}
                    </p>
                  )}
                </div>

                <div className="border-t border-warmGray-200 my-6" />

                <div className="flex justify-between font-bold text-xl mb-6">
                  <span>Tổng cộng</span>
                  <span className="text-christmas-burgundy">{formatPrice(total)}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-christmas-burgundy hover:bg-christmas-burgundy/90 hover-lift mb-4"
                  onClick={() => navigate("/thanh-toan")}
                >
                  Tiến hành thanh toán
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Link
                  to="/san-pham"
                  className="block text-center text-sm text-christmas-burgundy hover:text-christmas-burgundy/80 transition-smooth font-medium"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
