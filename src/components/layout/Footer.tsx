import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎄</span>
              <span className="font-bold text-xl">Noel Shop</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Chuyên cung cấp đồ trang trí Giáng sinh chất lượng cao với giá tốt
              nhất. Mang không khí Noel ấm áp đến mọi gia đình.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liên kết nhanh</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/san-pham"
                className="text-background/70 hover:text-background transition-colors"
              >
                Sản phẩm
              </Link>
              <Link
                to="/combo"
                className="text-background/70 hover:text-background transition-colors"
              >
                Combo tiết kiệm
              </Link>
              <Link
                to="/ve-chung-toi"
                className="text-background/70 hover:text-background transition-colors"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/chinh-sach"
                className="text-background/70 hover:text-background transition-colors"
              >
                Chính sách đổi trả
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liên hệ</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:0909123456"
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
              >
                <Phone className="h-4 w-4" />
                0909 123 456
              </a>
              <a
                href="mailto:info@noelshop.vn"
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@noelshop.vn
              </a>
              <div className="flex items-start gap-2 text-background/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123 Đường Noel, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kết nối</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <p className="text-sm text-background/70">
                Giờ làm việc: 8:00 - 21:00
              </p>
              <p className="text-sm text-background/70">
                Thứ 2 - Chủ nhật
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-background/50">
            © 2024 Noel Shop. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
