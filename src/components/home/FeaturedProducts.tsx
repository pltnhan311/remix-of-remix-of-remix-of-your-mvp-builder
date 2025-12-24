import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { productService } from "@/services";
import ProductCard from "@/components/product/ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const featured = productService.getFeatured(8);
    setProducts(featured);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              ⭐ Sản phẩm nổi bật
            </h2>
            <p className="text-muted-foreground mt-1">
              Những sản phẩm được yêu thích nhất
            </p>
          </div>
          <Link
            to="/san-pham?featured=true"
            className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/san-pham?featured=true"
            className="inline-flex items-center gap-1 text-primary font-medium"
          >
            Xem tất cả sản phẩm nổi bật
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
