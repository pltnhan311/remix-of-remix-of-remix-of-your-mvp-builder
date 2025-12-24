import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
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
      className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground">
              Nổi bật
            </Badge>
          )}
          {!isInStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Hết hàng
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-md"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-md"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-card-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </p>
            {hasMultipleVariants && (
              <p className="text-xs text-muted-foreground">
                {product.variants.length} phân loại
              </p>
            )}
          </div>
          
          {isInStock && defaultVariant && (
            <span className="text-xs text-muted-foreground">
              Còn {defaultVariant.stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
