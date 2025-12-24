import { useState, useMemo } from "react";
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orderService, productService, comboService } from "@/services";
import { formatPrice } from "@/lib/format";

type TimeFilter = 'today' | 'week' | 'month' | 'all';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const stats = useMemo(() => {
    const now = new Date();
    let dateFrom: string | undefined;
    
    switch (timeFilter) {
      case 'today':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFrom = weekAgo.toISOString();
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        dateFrom = monthAgo.toISOString();
        break;
    }

    return orderService.getStats(dateFrom);
  }, [timeFilter]);

  const totalProducts = productService.getAllAdmin().length;
  const totalCombos = comboService.getAll().length;

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày' },
    { value: 'month', label: '30 ngày' },
    { value: 'all', label: 'Tất cả' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động cửa hàng</p>
        </div>
        
        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div className="flex bg-secondary rounded-lg p-1">
            {timeFilterOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeFilter === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(option.value)}
                className="rounded-md"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingOrders} đang chờ xử lý
            </p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ {stats.deliveredOrders} đơn đã giao
            </p>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCombos} combo
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Giá trị TB/đơn</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatPrice(stats.averageOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trung bình mỗi đơn hàng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tình trạng đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-yellow-100 rounded-lg">
              <p className="text-2xl font-bold text-yellow-800">{stats.pendingOrders}</p>
              <p className="text-sm text-yellow-700">Chờ xử lý</p>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">{stats.processingOrders}</p>
              <p className="text-sm text-blue-700">Đang xử lý</p>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <p className="text-2xl font-bold text-purple-800">{stats.shippedOrders}</p>
              <p className="text-sm text-purple-700">Đang giao</p>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <p className="text-2xl font-bold text-green-800">{stats.deliveredOrders}</p>
              <p className="text-sm text-green-700">Đã giao</p>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-lg">
              <p className="text-2xl font-bold text-red-800">{stats.cancelledOrders}</p>
              <p className="text-sm text-red-700">Đã hủy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
