import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cartService, orderService } from "@/services";
import { formatPrice } from "@/lib/format";
import { CustomerInfo } from "@/types";
import { z } from "zod";

// Validation schema
const customerSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
  phone: z.string().trim().regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().trim().min(5, "Địa chỉ phải có ít nhất 5 ký tự").max(200),
  province: z.string().trim().min(2, "Vui lòng nhập Tỉnh/Thành phố"),
  district: z.string().trim().min(2, "Vui lòng nhập Quận/Huyện"),
  ward: z.string().trim().min(2, "Vui lòng nhập Phường/Xã"),
  note: z.string().max(500).optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const cart = cartService.getCart();
  const items = cart.items;
  const subtotal = cartService.getSubtotal();
  const shippingFee = cartService.getShippingFee();
  const total = cartService.getTotal();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate("/gio-hang");
    return null;
  }

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate
    const result = customerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Validate cart
    const cartValidation = cartService.validate();
    if (!cartValidation.valid) {
      toast({
        title: "Lỗi giỏ hàng",
        description: cartValidation.errors[0],
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Create order
    const orderResult = orderService.createOrder(formData);
    
    if (orderResult.success && orderResult.order) {
      navigate(`/dat-hang-thanh-cong/${orderResult.order.orderCode}`);
    } else {
      toast({
        title: "Đặt hàng thất bại",
        description: orderResult.error || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/gio-hang" className="hover:text-primary">Giỏ hàng</Link>
          <span>/</span>
          <span className="text-foreground">Thanh toán</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border p-6">
                <h2 className="font-bold text-xl mb-6">Thông tin giao hàng</h2>

                <div className="grid gap-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={e => handleChange("fullName", e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                        placeholder="0909123456"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder="email@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={e => handleChange("address", e.target.value)}
                      placeholder="Số nhà, tên đường"
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Province, District, Ward */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={e => handleChange("province", e.target.value)}
                        placeholder="TP.HCM"
                        className={errors.province ? "border-destructive" : ""}
                      />
                      {errors.province && (
                        <p className="text-sm text-destructive mt-1">{errors.province}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={e => handleChange("district", e.target.value)}
                        placeholder="Quận 1"
                        className={errors.district ? "border-destructive" : ""}
                      />
                      {errors.district && (
                        <p className="text-sm text-destructive mt-1">{errors.district}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ward">Phường/Xã *</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        onChange={e => handleChange("ward", e.target.value)}
                        placeholder="Phường Bến Nghé"
                        className={errors.ward ? "border-destructive" : ""}
                      />
                      {errors.ward && (
                        <p className="text-sm text-destructive mt-1">{errors.ward}</p>
                      )}
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <Label htmlFor="note">Ghi chú</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={e => handleChange("note", e.target.value)}
                      placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Back to cart */}
              <Link to="/gio-hang" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại giỏ hàng
              </Link>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-card rounded-xl border p-6 sticky top-24">
                <h2 className="font-bold text-xl mb-4">Đơn hàng của bạn</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.variantId || ''}-${index}`}
                      className="flex gap-3"
                    >
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

                <div className="border-t my-4" />

                {/* Totals */}
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
                </div>

                <div className="border-t my-4" />

                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                {/* Payment Method - COD only */}
                <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Thanh toán khi nhận hàng</p>
                      <p className="text-xs text-muted-foreground">COD - Giao hàng tận nơi</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Checkout;
