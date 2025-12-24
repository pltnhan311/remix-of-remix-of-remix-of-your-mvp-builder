import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combo } from "@/types";
import { comboService } from "@/services";
import { formatPrice } from "@/lib/format";

const FeaturedCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);

  useEffect(() => {
    const featured = comboService.getFeatured(3);
    setCombos(featured);
  }, []);

  if (combos.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              🎁 Combo tiết kiệm
            </h2>
            <p className="text-muted-foreground mt-1">
              Mua combo để được giảm giá lên đến 40%
            </p>
          </div>
          <Link
            to="/combo"
            className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <Link
              key={combo.id}
              to={`/combo/${combo.slug}`}
              className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <img
                  src={combo.images[0]}
                  alt={combo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Discount badge */}
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-sm px-3 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  -{combo.discountPercent}%
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                  {combo.name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {combo.description}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(combo.discountPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(combo.originalPrice)}
                    </p>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/combo"
            className="inline-flex items-center gap-1 text-primary font-medium"
          >
            Xem tất cả combo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCombos;
