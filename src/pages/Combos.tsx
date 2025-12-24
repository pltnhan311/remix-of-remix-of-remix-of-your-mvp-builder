import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag, Gift, Package } from "lucide-react";
import { MainLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combo } from "@/types";
import { comboService } from "@/services";
import { formatPrice } from "@/lib/format";

const Combos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = comboService.getActive();
    setCombos(result.data);
    setLoading(false);
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/20 rounded-full">
              <Gift className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            🎁 Combo tiết kiệm
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mua combo để tiết kiệm hơn! Các bộ sản phẩm được chọn lọc với mức giảm giá lên đến 40%
          </p>
        </div>
      </section>

      {/* Combos Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden border animate-pulse">
                  <div className="aspect-[16/10] bg-secondary" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-secondary rounded w-3/4" />
                    <div className="h-4 bg-secondary rounded w-full" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : combos.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                Chưa có combo nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Các combo sản phẩm sẽ sớm được cập nhật
              </p>
              <Button asChild>
                <Link to="/san-pham">Xem sản phẩm</Link>
              </Button>
            </div>
          ) : (
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

                    {/* Items count badge */}
                    <Badge variant="secondary" className="absolute top-3 left-3">
                      <Package className="h-3 w-3 mr-1" />
                      {combo.items.length} sản phẩm
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
                    
                    {/* Price */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-primary">
                          {formatPrice(combo.discountPrice)}
                        </p>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(combo.originalPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-accent font-medium">
                          Tiết kiệm {formatPrice(combo.originalPrice - combo.discountPrice)}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                      Xem chi tiết
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Giảm đến 40%</h3>
              <p className="text-sm text-muted-foreground">
                Mua combo để tiết kiệm hơn so với mua lẻ từng sản phẩm
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Combo tuyển chọn</h3>
              <p className="text-sm text-muted-foreground">
                Các sản phẩm được phối hợp hoàn hảo cho mùa lễ hội
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Đóng gói đẹp</h3>
              <p className="text-sm text-muted-foreground">
                Hộp quà sang trọng, phù hợp làm quà tặng
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Combos;
