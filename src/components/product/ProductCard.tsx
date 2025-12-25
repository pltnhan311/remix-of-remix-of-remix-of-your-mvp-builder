import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { productService, cartService } from "@/services";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onCartUpdate?: () => void;
}

const ProductCard = ({ product, onCartUpdate }: ProductCardProps) => {
  const isInStock = productService.isInStock(product.id);
  const defaultVariant = product.variants[0];
  const price = productService.getPrice(product, defaultVariant?.id);
  const hasMultipleVariants = product.variants.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock || !defaultVariant) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    const result = cartService.addItem(product.id, defaultVariant.id, 1);
    if (result.success) {
      toast.success("Đã thêm vào giỏ hàng");
      onCartUpdate?.();
    } else {
      toast.error(result.error || "Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <Link
      to={`/san-pham/${product.slug}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-soft hover-lift transition-smooth border border-warmGray-200"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-warmGray-100">
        <div className="image-zoom-container w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="image-zoom w-full h-full object-cover"
          />
        </div>

        {/* Badges - Top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-christmas-burgundy text-white shadow-soft font-medium">
              Nổi bật
            </Badge>
          )}
          {!isInStock && (
            <Badge className="bg-warmGray-400 text-white shadow-soft">
              Hết hàng
            </Badge>
          )}
        </div>

        {/* Quick Add Button - Slides up from bottom */}
        {isInStock && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              className="w-full rounded-none bg-christmas-burgundy hover:bg-christmas-burgundy/90 text-white h-12 font-medium"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Thêm vào giỏ
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 min-h-[3.5rem] mb-3 group-hover:text-christmas-burgundy transition-smooth">
          {product.name}
        </h3>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-christmas-burgundy">
              {formatPrice(price)}
            </p>
            {hasMultipleVariants && (
              <p className="text-xs text-muted-foreground mt-1">
                {product.variants.length} phân loại
              </p>
            )}
          </div>

          {isInStock && defaultVariant && defaultVariant.stock <= 10 && (
            <span className="text-xs text-christmas-sage font-medium">
              Còn {defaultVariant.stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
