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

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Featured Combos */}
      <FeaturedCombos />

      {/* Newsletter / CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            🎄 Đừng bỏ lỡ ưu đãi Giáng Sinh!
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Đăng ký nhận thông tin để cập nhật khuyến mãi mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-background/50"
            />
            <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
