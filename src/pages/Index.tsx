import { MainLayout } from "@/components/layout";
import {
  BannerSlider,
  CategoryGrid,
  FeaturedProducts,
  FeaturedCombos
} from "@/components/home";
import FeaturesBanner from "@/components/home/FeaturesBanner";

const Index = () => {
  return (
    <MainLayout>
      {/* Banner Slider */}
      <BannerSlider />

      {/* Features Banner */}
      <FeaturesBanner />

      {/* Category Grid - Off white background */}
      <section className="bg-warm-50 py-16 md:py-20">
        <CategoryGrid />
      </section>

      {/* Featured Products - White background */}
      <section className="bg-white py-16 md:py-20">
        <FeaturedProducts />
      </section>

      {/* Featured Combos - Beige background */}
      <section className="bg-warm-100 py-16 md:py-20">
        <FeaturedCombos />
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-20 md:py-24 bg-cranberry">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            🎄 Đừng bỏ lỡ ưu đãi Giáng Sinh!
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto text-base leading-relaxed">
            Đăng ký nhận thông tin để cập nhật khuyến mãi mới nhất và ưu đãi độc quyền
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-5 py-3.5 rounded-md text-warm-600 bg-white focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-warm-400"
            />
            <button className="px-8 py-3.5 bg-gold-muted hover:bg-gold-muted/90 text-warm-600 font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;

