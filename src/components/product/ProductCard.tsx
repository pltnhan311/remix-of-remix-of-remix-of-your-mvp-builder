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
      className="group block bg-white rounded-lg shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-all duration-200"
    >
      {/* Image Container with padding */}
      <div className="p-3">
        <div className="relative aspect-square overflow-hidden rounded-md bg-warm-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />

          {/* Badges - Muted colors */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.featured && (
              <Badge className="bg-pine text-white text-xs font-medium px-2.5 py-0.5">
                Nổi bật
              </Badge>
            )}
            {!isInStock && (
              <Badge className="bg-warm-300 text-warm-600 text-xs font-medium px-2.5 py-0.5">
                Hết hàng
              </Badge>
            )}
          </div>

          {/* Quick Add Button - Bottom slide up */}
          {isInStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
              <Button
                className="w-full rounded-none rounded-b-md bg-cranberry hover:bg-cranberry-hover text-white h-10 font-medium"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Thêm vào giỏ
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <h3 className="font-medium text-warm-600 line-clamp-2 min-h-[2.75rem] text-[15px] leading-snug group-hover:text-cranberry transition-colors duration-200">
          {product.name}
        </h3>

        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-cranberry">
              {formatPrice(price)}
            </p>
            {hasMultipleVariants && (
              <p className="text-xs text-warm-400 mt-0.5">
                {product.variants.length} phân loại
              </p>
            )}
          </div>

          {isInStock && defaultVariant && defaultVariant.stock <= 10 && (
            <span className="text-xs text-gold-muted font-medium">
              Còn {defaultVariant.stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

