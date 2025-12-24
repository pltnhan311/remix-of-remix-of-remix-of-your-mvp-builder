import { useState, useMemo } from "react";
import { 
  Search, 
  ChevronRight,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { orderService } from "@/services";
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/format";
import { Order, OrderStatus } from "@/types";

const StatusIcon = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'processing': return <Package className="h-4 w-4" />;
    case 'shipped': return <Truck className="h-4 w-4" />;
    case 'delivered': return <CheckCircle className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
  }
};

const OrderList = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>(orderService.getAll());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== "all") {
      result = result.filter(o => o.status === statusFilter);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(o =>
        o.orderCode.toLowerCase().includes(searchLower) ||
        o.customer.fullName.toLowerCase().includes(searchLower) ||
        o.customer.phone.includes(search)
      );
    }

    return result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, statusFilter, search]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    const result = orderService.updateStatus(orderId, newStatus);
    
    if (result.success) {
      setOrders(orderService.getAll());
      toast({
        title: "Đã cập nhật",
        description: `Đơn hàng đã chuyển sang "${ORDER_STATUS_LABELS[newStatus]}"`,
      });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(orderService.getById(orderId));
      }
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    }
    setIsUpdating(false);
  };

  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'pending': return ['processing', 'cancelled'];
      case 'processing': return ['shipped', 'cancelled'];
      case 'shipped': return ['delivered'];
      default: return [];
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">{orders.length} đơn hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="shipped">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Không có đơn hàng</h2>
          <p className="text-muted-foreground">
            {search || statusFilter !== "all" ? "Không tìm thấy đơn hàng phù hợp" : "Chưa có đơn hàng nào"}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-primary">
                    #{order.orderCode}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.fullName}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={ORDER_STATUS_COLORS[order.status]}>
                      <StatusIcon status={order.status} />
                      <span className="ml-1">{ORDER_STATUS_LABELS[order.status]}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {getNextStatuses(order.status).map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          variant={nextStatus === 'cancelled' ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, nextStatus)}
                          disabled={isUpdating}
                          className={nextStatus === 'cancelled' ? "text-destructive border-destructive" : ""}
                        >
                          {ORDER_STATUS_LABELS[nextStatus]}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Chi tiết
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Chi tiết đơn hàng #{selectedOrder.orderCode}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge className={ORDER_STATUS_COLORS[selectedOrder.status]}>
                    <StatusIcon status={selectedOrder.status} />
                    <span className="ml-1">{ORDER_STATUS_LABELS[selectedOrder.status]}</span>
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatDateTime(selectedOrder.createdAt)}
                  </span>
                </div>

                {/* Customer */}
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                  <p>{selectedOrder.customer.fullName}</p>
                  <p className="text-muted-foreground">{selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.email && (
                    <p className="text-muted-foreground">{selectedOrder.customer.email}</p>
                  )}
                  <p className="text-sm mt-2">
                    {selectedOrder.customer.address}, {selectedOrder.customer.ward}, {selectedOrder.customer.district}, {selectedOrder.customer.province}
                  </p>
                  {selectedOrder.customer.note && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Ghi chú: {selectedOrder.customer.note}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-medium mb-3">Sản phẩm</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          {item.variantName && (
                            <p className="text-sm text-muted-foreground">{item.variantName}</p>
                          )}
                          <p className="text-sm">x{item.quantity}</p>
                        </div>
                        <p className="font-medium shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{selectedOrder.shippingFee === 0 ? "Miễn phí" : formatPrice(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Actions */}
                {getNextStatuses(selectedOrder.status).length > 0 && (
                  <div className="flex justify-end gap-2">
                    {getNextStatuses(selectedOrder.status).map((nextStatus) => (
                      <Button
                        key={nextStatus}
                        variant={nextStatus === 'cancelled' ? "outline" : "default"}
                        onClick={() => handleUpdateStatus(selectedOrder.id, nextStatus)}
                        disabled={isUpdating}
                        className={nextStatus === 'cancelled' ? "text-destructive border-destructive" : ""}
                      >
                        Chuyển sang "{ORDER_STATUS_LABELS[nextStatus]}"
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
