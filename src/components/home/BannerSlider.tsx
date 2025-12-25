import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Banner } from "@/types";
import { bannerService } from "@/services";

const BannerSlider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const activeBanners = bannerService.getActive();
    setBanners(activeBanners);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(nextSlide, 6000); // Slower for elegance
    return () => clearInterval(timer);
  }, [banners.length, nextSlide]);

  if (banners.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-christmas-cream via-warmGray-100 to-christmas-sage/10 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-christmas-burgundy mb-4">
            🎄 Giáng Sinh An Lành
          </h1>
          <p className="font-handwritten text-xl md:text-2xl text-christmas-sage">
            Chào mừng đến với Noel Shop
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full h-full flex-shrink-0">
            {/* Image with zoom effect */}
            <div className="image-zoom-container w-full h-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="image-zoom w-full h-full object-cover"
              />
            </div>

            {/* Elegant dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-christmas-charcoal/70 via-christmas-charcoal/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-6xl font-bold mb-4 text-white leading-tight animate-fade-in">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <Link to={banner.link}>
                      <Button
                        size="lg"
                        className="bg-christmas-burgundy hover:bg-christmas-burgundy/90 text-white hover-lift px-8 py-6 text-lg font-medium shadow-soft-lg"
                      >
                        Khám phá ngay
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - Refined */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover-lift w-12 h-12"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover-lift w-12 h-12"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots - More elegant */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentIndex
                  ? "bg-white w-10"
                  : "bg-white/40 hover:bg-white/60 w-2"
                }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
