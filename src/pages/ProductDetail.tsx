import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check, Package } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { productService, cartService, categoryService } from "@/services";
import { formatPrice } from "@/lib/format";
import { ProductVariant } from "@/types";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const product = productService.getBySlug(slug || "");
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Group variants by type
  const variantsByType = useMemo(() => {
    if (!product) return { color: [], size: [] };
    return {
      color: product.variants.filter(v => v.type === 'color'),
      size: product.variants.filter(v => v.type === 'size'),
    };
  }, [product]);

  // Get related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productService.getByCategory(product.categoryId)
      .filter(p => p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-6">
            Sản phẩm này có thể đã bị xóa hoặc không tồn tại
          </p>
          <Button onClick={() => navigate("/san-pham")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </MainLayout>
    );
  }

  const category = categoryService.getById(product.categoryId);
  const currentPrice = productService.getPrice(product, selectedVariant?.id);
  const stock = selectedVariant 
    ? selectedVariant.stock 
    : product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    // Require variant selection if variants exist
    if (product.variants.length > 0 && !selectedVariant) {
      toast({
        title: "Vui lòng chọn phân loại",
        description: "Hãy chọn màu sắc hoặc kích thước trước khi thêm vào giỏ",
        variant: "destructive",
      });
      return;
    }

    const result = cartService.addItem(product.id, selectedVariant?.id, quantity);
    
    if (result.success) {
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${product.name}${selectedVariant ? ` - ${selectedVariant.name}` : ""} x${quantity}`,
      });
    } else {
      toast({
        title: "Không thể thêm",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/gio-hang");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/san-pham" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          {category && (
            <>
              <Link to={`/san-pham?category=${category.id}`} className="hover:text-primary">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? "border-primary" 
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {category && (
              <Badge variant="secondary">{category.name}</Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(currentPrice)}
              </span>
              {selectedVariant && selectedVariant.priceModifier !== 0 && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isOutOfStock ? (
                <span className="text-destructive font-medium">Hết hàng</span>
              ) : (
                <span className="text-green-600 font-medium">
                  Còn {stock} sản phẩm
                </span>
              )}
            </div>

            {/* Color Variants */}
            {variantsByType.color.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  Màu sắc: {selectedVariant?.type === 'color' && selectedVariant.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variantsByType.color.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      } ${variant.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                      style={{ backgroundColor: variant.value }}
                      title={`${variant.name}${variant.stock === 0 ? " (Hết hàng)" : ""}`}
                    >
                      {selectedVariant?.id === variant.id && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants */}
            {variantsByType.size.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  Kích thước: {selectedVariant?.type === 'size' && selectedVariant.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variantsByType.size.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      } ${variant.stock === 0 ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Số lượng</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm vào giỏ
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Mua ngay
              </Button>
            </div>

            {/* Description */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
