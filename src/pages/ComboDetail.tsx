import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Package, Check, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { comboService, productService, cartService } from "@/services";
import { formatPrice } from "@/lib/format";

const ComboDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const combo = slug ? comboService.getBySlug(slug) : null;

  if (!slug) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Combo không tồn tại</h1>
          <p className="text-muted-foreground mb-6">
            Không tìm thấy combo bạn đang tìm kiếm
          </p>
          <Link to="/combo">
            <Button>Xem các combo khác</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (!combo) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4 mt-8 lg:mt-0">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get products in combo
  const comboProducts = combo.items.map(item => {
    const product = productService.getById(item.productId);
    const variant = item.variantId 
      ? product?.variants.find(v => v.id === item.variantId)
      : null;
    return { item, product, variant };
  }).filter(({ product }) => product !== null);

  const isInStock = comboService.isInStock(combo.id);
  const savings = combo.originalPrice - combo.discountPrice;

  const handlePrevImage = () => {
    setCurrentImage(prev => 
      prev === 0 ? combo.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImage(prev => 
      prev === combo.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    if (!isInStock) {
      toast({
        title: "Hết hàng",
        description: "Combo này hiện đang hết hàng",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    // Add all products in combo to cart
    let success = true;
    for (const { item, product, variant } of comboProducts) {
      if (product) {
        const pricePerItem = combo.discountPrice / combo.items.reduce((sum, i) => sum + i.quantity, 0);
        
        const cartItem = {
          productId: product.id,
          variantId: item.variantId,
          comboId: combo.id,
          quantity: item.quantity,
          price: pricePerItem * item.quantity,
          name: `[Combo] ${product.name}`,
          image: product.images[0] || '',
          variantName: variant?.name,
        };

        const result = cartService.addItem(product.id, item.variantId, item.quantity);
        if (!result.success) {
          success = false;
          toast({
            title: "Lỗi",
            description: result.error || "Không thể thêm sản phẩm",
            variant: "destructive",
          });
          break;
        }
      }
    }

    if (success) {
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${combo.name} với ${comboProducts.length} sản phẩm`,
      });
    }

    setIsAdding(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/combo" className="hover:text-primary">Combo</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{combo.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src={combo.images[currentImage]}
                alt={combo.name}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-lg px-3 py-1">
                -{combo.discountPercent}%
              </Badge>

              {/* Navigation arrows */}
              {combo.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {combo.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {combo.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${combo.name} - Ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Combo Info */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-3xl font-bold mb-4">{combo.name}</h1>
            
            <p className="text-muted-foreground mb-6">{combo.description}</p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(combo.discountPrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(combo.originalPrice)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-accent font-medium">
                <Check className="h-5 w-5" />
                <span>Tiết kiệm {formatPrice(savings)}</span>
              </div>
            </div>

            {/* Stock status */}
            <div className="mb-6">
              {isInStock ? (
                <Badge variant="outline" className="text-accent border-accent">
                  <Check className="h-4 w-4 mr-1" />
                  Còn hàng
                </Badge>
              ) : (
                <Badge variant="outline" className="text-destructive border-destructive">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Hết hàng
                </Badge>
              )}
            </div>

            {/* Products in Combo */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Sản phẩm trong combo ({comboProducts.length})
              </h3>
              <div className="space-y-3">
                {comboProducts.map(({ item, product, variant }) => (
                  <Link
                    key={`${item.productId}-${item.variantId || ''}`}
                    to={`/san-pham/${product?.slug}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={product?.images[0]}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{product?.name}</p>
                      {variant && (
                        <p className="text-sm text-muted-foreground">{variant.name}</p>
                      )}
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium">
                        {formatPrice(productService.getPrice(product!, item.variantId) * item.quantity)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!isInStock || isAdding}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAdding ? "Đang thêm..." : isInStock ? "Thêm combo vào giỏ hàng" : "Hết hàng"}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComboDetail;
