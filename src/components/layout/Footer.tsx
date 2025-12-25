import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, MessageCircle, Truck, RotateCcw, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-pine text-white">
      {/* Trust Badges */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Miễn phí vận chuyển</p>
                <p className="text-sm text-white/70">Đơn hàng từ 500.000₫</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Đổi trả dễ dàng</p>
                <p className="text-sm text-white/70">Trong vòng 7 ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Chất lượng đảm bảo</p>
                <p className="text-sm text-white/70">Sản phẩm chính hãng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🎄</span>
              <div>
                <span className="font-semibold text-2xl block">Noel Shop</span>
                <span className="text-xs text-white/60">Premium Christmas Decor</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Chuyên cung cấp đồ trang trí Giáng sinh chất lượng cao với giá tốt
              nhất. Mang không khí Noel ấm áp đến mọi gia đình Việt Nam.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Liên kết</h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/san-pham"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Sản phẩm
              </Link>
              <Link
                to="/combo"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Combo tiết kiệm
              </Link>
              <Link
                to="/lien-he"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Liên hệ
              </Link>
              <Link
                to="/chinh-sach"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Chính sách đổi trả
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Liên hệ</h4>
            <div className="flex flex-col gap-4">
              <a
                href="tel:0909123456"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200"
              >
                <Phone className="h-5 w-5" />
                0909 123 456
              </a>
              <a
                href="mailto:info@noelshop.vn"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
                info@noelshop.vn
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>123 Đường Noel, Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Kết nối với chúng tôi</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-8">
              <p className="text-sm text-white/70">Giờ làm việc</p>
              <p className="text-sm text-white mt-1">8:00 - 21:00, T2 - CN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-white/50">
            © 2024 Noel Shop. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

