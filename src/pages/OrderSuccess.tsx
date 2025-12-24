import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Phone, MapPin, Copy } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services";
import { formatPrice, formatDateTime } from "@/lib/format";

const OrderSuccess = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const order = orderService.getByCode(orderCode || "");

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
          <p className="text-muted-foreground mb-6">
            Đơn hàng này không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </MainLayout>
    );
  }

  const copyOrderCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    toast({
      title: "Đã sao chép",
      description: order.orderCode,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã mua hàng tại Noel Shop
            </p>
          </div>

          {/* Order Code */}
          <div className="bg-card rounded-xl border p-6 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Mã đơn hàng của bạn</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-primary">{order.orderCode}</span>
              <Button variant="ghost" size="icon" onClick={copyOrderCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Đặt lúc: {formatDateTime(order.createdAt)}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-xl border overflow-hidden mb-6">
            {/* Customer Info */}
            <div className="p-6 border-b">
              <h2 className="font-bold text-lg mb-4">Thông tin giao hàng</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.customer.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p>{order.customer.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p>
                    {order.customer.address}, {order.customer.ward}, {order.customer.district}, {order.customer.province}
                  </p>
                </div>
                {order.customer.note && (
                  <p className="text-sm text-muted-foreground italic">
                    Ghi chú: {order.customer.note}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b">
              <h2 className="font-bold text-lg mb-4">Sản phẩm đã đặt</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-sm">x{item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-secondary/30">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>
                    {order.shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(order.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-accent/10 rounded-xl p-6 mb-8">
            <h3 className="font-semibold mb-2">📦 Bước tiếp theo</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24h</li>
              <li>• Thời gian giao hàng dự kiến: 2-5 ngày làm việc</li>
              <li>• Thanh toán khi nhận hàng (COD)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/san-pham">Tiếp tục mua sắm</Link>
            </Button>
            <Button size="lg" asChild>
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccess;
