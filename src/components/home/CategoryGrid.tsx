import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { categoryService } from "@/services";

const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const allCategories = categoryService.getAll();
    setCategories(allCategories);
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Danh mục sản phẩm
            </h2>
            <p className="text-muted-foreground mt-1">
              Khám phá các loại đồ trang trí Giáng sinh
            </p>
          </div>
          <Link
            to="/san-pham"
            className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/san-pham?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              </div>

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <h3 className="font-semibold text-background text-sm md:text-base line-clamp-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-1 text-primary font-medium"
          >
            Xem tất cả danh mục
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
