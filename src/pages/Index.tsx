import { MainLayout } from "@/components/layout";
import {
  BannerSlider,
  CategoryGrid,
  FeaturedProducts,
  FeaturedCombos
} from "@/components/home";
import FeaturesBanner from "@/components/home/FeaturesBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Banner Slider */}
      <BannerSlider />

      {/* Features Banner */}
      <FeaturesBanner />

      {/* Category Grid */}
      <section className="py-16 bg-warmGray-50">
        <CategoryGrid />
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <FeaturedProducts />
      </section>

      {/* Featured Combos */}
      <section className="py-16 bg-christmas-cream">
        <FeaturedCombos />
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-christmas-burgundy to-christmas-forest relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🎄</div>
          <div className="absolute bottom-10 right-10 text-9xl">⭐</div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <Sparkles className="h-12 w-12 text-christmas-champagne mx-auto mb-4 animate-bounce-soft" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Trang trí Giáng Sinh ấm áp
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Khám phá bộ sưu tập đồ trang trí Noel độc đáo, mang lại không khí lễ hội đầy ấm cúng cho gia đình bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/san-pham">
                <Button
                  size="lg"
                  className="bg-white text-christmas-burgundy hover:bg-white/90 px-8 py-6 text-lg font-medium shadow-soft-lg hover-lift"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Mua sắm ngay
                </Button>
              </Link>
              <Link to="/combo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-christmas-burgundy px-8 py-6 text-lg font-medium hover-lift"
                >
                  Xem Combo tiết kiệm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
