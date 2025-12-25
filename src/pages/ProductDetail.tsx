import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingCart, Check, Package } from "lucide-react";
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
        <div className="bg-warm-50 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-soft-sm">
              <div className="text-6xl mb-4">😢</div>
              <h1 className="text-xl font-semibold mb-3">Không tìm thấy sản phẩm</h1>
              <p className="text-warm-500 mb-6 text-sm">
                Sản phẩm này có thể đã bị xóa hoặc không tồn tại
              </p>
              <Button onClick={() => navigate("/san-pham")} className="bg-cranberry hover:bg-cranberry-hover">
                Quay lại danh sách
              </Button>
            </div>
          </div>
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
      <div className="bg-warm-50">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-warm-500 mb-6 flex-wrap">
            <Link to="/" className="hover:text-cranberry transition-colors">Trang chủ</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/san-pham" className="hover:text-cranberry transition-colors">Sản phẩm</Link>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link to={`/san-pham?category=${category.id}`} className="hover:text-cranberry transition-colors">
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-warm-600 font-medium">{product.name}</span>
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-soft-sm p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-warm-100">
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
                        className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                            ? "border-cranberry"
                            : "border-warm-200 hover:border-cranberry/50"
                          }`}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-5">
                {/* Category Badge */}
                {category && (
                  <Badge className="bg-pine-soft text-pine font-medium">{category.name}</Badge>
                )}

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-semibold text-warm-600">{product.name}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-cranberry">
                    {formatPrice(currentPrice)}
                  </span>
                  {selectedVariant && selectedVariant.priceModifier !== 0 && (
                    <span className="text-base text-warm-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-warm-400" />
                  {isOutOfStock ? (
                    <span className="text-red-500 font-medium">Hết hàng</span>
                  ) : (
                    <span className="text-pine font-medium">
                      Còn {stock} sản phẩm
                    </span>
                  )}
                </div>

                {/* Color Variants */}
                {variantsByType.color.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-warm-600 mb-2">
                      Màu sắc: <span className="text-cranberry">{selectedVariant?.type === 'color' && selectedVariant.name}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variantsByType.color.map(variant => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={variant.stock === 0}
                          className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 ${selectedVariant?.id === variant.id
                              ? "border-cranberry ring-2 ring-cranberry/30 ring-offset-1"
                              : "border-warm-300 hover:border-cranberry/50"
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
                    <h3 className="text-sm font-medium text-warm-600 mb-2">
                      Kích thước: <span className="text-cranberry">{selectedVariant?.type === 'size' && selectedVariant.name}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variantsByType.size.map(variant => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={variant.stock === 0}
                          className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${selectedVariant?.id === variant.id
                              ? "border-cranberry bg-cranberry text-white"
                              : "border-warm-300 hover:border-cranberry text-warm-600"
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
                  <h3 className="text-sm font-medium text-warm-600 mb-2">Số lượng</h3>
                  <div className="inline-flex items-center border border-warm-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-warm-100"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-warm-100"
                      onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                      disabled={quantity >= stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-cranberry text-cranberry hover:bg-cranberry hover:text-white transition-all duration-200"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  <Button
                    className="flex-1 bg-cranberry hover:bg-cranberry-hover transition-all duration-200"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                  >
                    Mua ngay
                  </Button>
                </div>

                {/* Description */}
                <div className="pt-5 border-t border-warm-200">
                  <h3 className="text-sm font-medium text-warm-600 mb-2">Mô tả sản phẩm</h3>
                  <p className="text-warm-500 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold text-warm-600 mb-6">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;

