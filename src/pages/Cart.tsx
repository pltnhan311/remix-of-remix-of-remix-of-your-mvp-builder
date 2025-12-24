import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-muted-foreground mb-8">
            Hãy khám phá các sản phẩm trang trí Giáng Sinh tuyệt vời của chúng tôi!
          </p>
          <Button size="lg" onClick={() => navigate("/san-pham")}>
            <ShoppingBag className="h-5 w-5 mr-2" />
            Mua sắm ngay
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <span className="text-foreground">Giỏ hàng</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.variantId || ''}-${index}`}
                className="flex gap-4 p-4 bg-card rounded-xl border"
              >
                {/* Image */}
                <Link to={`/san-pham/${item.productId}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/san-pham/${item.productId}`}
                    className="font-semibold hover:text-primary line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.variantName && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Phân loại: {item.variantName}
                    </p>
                  )}
                  <p className="font-bold text-primary mt-2">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>

                {/* Item Total (Desktop) */}
                <div className="hidden sm:block text-right">
                  <p className="font-bold text-lg">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-card rounded-xl border p-6 sticky top-24">
              <h2 className="font-bold text-xl mb-4">Tổng đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-medium">Miễn phí</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Miễn phí vận chuyển cho đơn từ {formatPrice(500000)}
                  </p>
                )}
              </div>

              <div className="border-t my-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate("/thanh-toan")}
              >
                Tiến hành thanh toán
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Link to="/san-pham" className="block text-center mt-4 text-sm text-primary hover:underline">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
