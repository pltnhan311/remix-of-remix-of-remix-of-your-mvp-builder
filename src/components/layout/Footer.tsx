import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-christmas-cream border-t border-warmGray-200">
      {/* Newsletter Section */}
      <div className="bg-christmas-burgundy text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif font-bold text-3xl mb-3">
              Nhận thông tin ưu đãi
            </h3>
            <p className="text-white/90 mb-6">
              Đăng ký để nhận tin tức mới nhất về sản phẩm và khuyến mãi đặc biệt
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email của bạn..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
              />
              <Button className="bg-white text-christmas-burgundy hover:bg-white/90 px-6">
                <Send className="h-4 w-4 mr-2" />
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-warmGray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-christmas-sage/10 flex items-center justify-center flex-shrink-0">
              <Truck className="h-6 w-6 text-christmas-sage" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Miễn phí vận chuyển</h4>
              <p className="text-sm text-muted-foreground">Cho đơn hàng từ 500.000₫</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-christmas-sage/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-christmas-sage" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Đổi trả dễ dàng</h4>
              <p className="text-sm text-muted-foreground">Trong vòng 7 ngày</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-christmas-sage/10 flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-christmas-sage" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Chất lượng đảm bảo</h4>
              <p className="text-sm text-muted-foreground">Sản phẩm chính hãng 100%</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎄</span>
              <div>
                <span className="font-serif font-bold text-2xl text-christmas-burgundy block leading-none">
                  Noel Shop
                </span>
                <span className="font-handwritten text-sm text-christmas-sage">
                  Christmas Decor
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Chuyên cung cấp đồ trang trí Giáng sinh chất lượng cao, mang không khí Noel ấm áp đến mọi gia đình.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-foreground">Liên kết</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/san-pham"
                className="text-muted-foreground hover:text-christmas-burgundy transition-smooth text-sm"
              >
                Sản phẩm
              </Link>
              <Link
                to="/combo"
                className="text-muted-foreground hover:text-christmas-burgundy transition-smooth text-sm"
              >
                Combo tiết kiệm
              </Link>
              <Link
                to="/lien-he"
                className="text-muted-foreground hover:text-christmas-burgundy transition-smooth text-sm"
              >
                Liên hệ
              </Link>
              <Link
                to="/chinh-sach"
                className="text-muted-foreground hover:text-christmas-burgundy transition-smooth text-sm"
              >
                Chính sách đổi trả
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-foreground">Liên hệ</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:0909123456"
                className="flex items-center gap-2 text-muted-foreground hover:text-christmas-burgundy transition-smooth text-sm group"
              >
                <Phone className="h-4 w-4 text-christmas-sage group-hover:text-christmas-burgundy transition-smooth" />
                0909 123 456
              </a>
              <a
                href="mailto:contact@noelshop.vn"
                className="flex items-center gap-2 text-muted-foreground hover:text-christmas-burgundy transition-smooth text-sm group"
              >
                <Mail className="h-4 w-4 text-christmas-sage group-hover:text-christmas-burgundy transition-smooth" />
                contact@noelshop.vn
              </a>
              <div className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-christmas-sage" />
                <span>123 Nguyễn Huệ, Quận 1<br />TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

          {/* Social & Hours */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-foreground">Kết nối</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-warmGray-200 flex items-center justify-center hover:bg-christmas-burgundy hover:text-white transition-smooth group"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-warmGray-200 flex items-center justify-center hover:bg-christmas-burgundy hover:text-white transition-smooth group"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Giờ làm việc</p>
              <p className="text-sm text-muted-foreground">
                T2 - T6: 8:00 - 20:00
              </p>
              <p className="text-sm text-muted-foreground">
                T7 - CN: 9:00 - 21:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warmGray-200 bg-warmGray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Noel Shop. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/chinh-sach" className="hover:text-christmas-burgundy transition-smooth">
                Chính sách bảo mật
              </Link>
              <Link to="/dieu-khoan" className="hover:text-christmas-burgundy transition-smooth">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
