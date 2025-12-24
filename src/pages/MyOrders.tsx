import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight, XCircle, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { authService, orderService } from "@/services";
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/format";
import { Order, OrderStatus } from "@/types";

const StatusIcon = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
  }
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/dang-nhap");
      return;
    }
    setOrders(orderService.getMyOrders());
  }, [navigate]);

  const handleCancelOrder = (orderId: string) => {
    setCancellingId(orderId);
    const result = orderService.cancelOrder(orderId);
    
    if (result.success) {
      toast({
        title: "Đã hủy đơn hàng",
        description: "Đơn hàng đã được hủy thành công",
      });
      setOrders(orderService.getMyOrders());
    } else {
      toast({
        title: "Không thể hủy",
        description: result.error || "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
    setCancellingId(null);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
            <p className="text-muted-foreground">Xin chào, {user.fullName}</p>
          </div>
          <Link to="/">
            <Button variant="outline">Tiếp tục mua sắm</Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
            </p>
            <Link to="/san-pham">
              <Button>Xem sản phẩm</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-xl border overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 border-b bg-secondary/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-primary">#{order.orderCode}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      <StatusIcon status={order.status} />
                      <span className="ml-1">{ORDER_STATUS_LABELS[order.status]}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                            disabled={cancellingId === order.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Hủy đơn
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hủy đơn hàng?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn hủy đơn hàng #{order.orderCode}?
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Không</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelOrder(order.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Hủy đơn hàng
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <Link to={`/dat-hang-thanh-cong/${order.orderCode}`}>
                      <Button variant="ghost" size="sm">
                        Chi tiết
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={`${item.productId}-${item.variantId || ''}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          {item.variantName && (
                            <p className="text-sm text-muted-foreground">{item.variantName}</p>
                          )}
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="font-medium shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{order.items.length - 3} sản phẩm khác
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 border-t bg-secondary/30 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                  </p>
                  <p className="font-bold text-lg">
                    Tổng: <span className="text-primary">{formatPrice(order.total)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Account Actions */}
        <div className="mt-8 p-4 bg-secondary/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                authService.logout();
                navigate("/");
                toast({
                  title: "Đã đăng xuất",
                  description: "Hẹn gặp lại bạn!",
                });
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyOrders;
