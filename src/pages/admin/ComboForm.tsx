import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Package,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { comboService, productService, categoryService } from "@/services";
import { Combo, ComboItem, Product, ProductVariant, Category } from "@/types";
import { formatPrice } from "@/lib/format";
import { z } from "zod";

const comboSchema = z.object({
    name: z.string().trim().min(2, "Tên combo phải có ít nhất 2 ký tự").max(200),
    description: z.string().trim().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    discountPrice: z.number().min(1000, "Giá combo phải lớn hơn 1,000đ"),
});

interface ComboItemWithDetails extends ComboItem {
    product?: Product;
    variant?: ProductVariant;
    price: number;
    total: number;
}

const ComboForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const isEditing = id && id !== "them";

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<{
        name: string;
        slug: string;
        description: string;
        images: string[];
        items: ComboItem[];
        originalPrice: number;
        discountPrice: number;
        discountPercent: number;
        featured: boolean;
        active: boolean;
    }>({
        name: "",
        slug: "",
        description: "",
        images: [],
        items: [],
        originalPrice: 0,
        discountPrice: 0,
        discountPercent: 0,
        featured: false,
        active: true,
    });

    // New item selection state
    const [newItem, setNewItem] = useState<{
        productId: string;
        variantId: string;
        quantity: number;
    }>({
        productId: "",
        variantId: "",
        quantity: 1,
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        setCategories(categoryService.getAll());
        setProducts(productService.getAll());

        if (isEditing) {
            const combo = comboService.getById(id);
            if (combo) {
                setFormData({
                    name: combo.name,
                    slug: combo.slug,
                    description: combo.description,
                    images: combo.images,
                    items: combo.items,
                    originalPrice: combo.originalPrice,
                    discountPrice: combo.discountPrice,
                    discountPercent: combo.discountPercent,
                    featured: combo.featured,
                    active: combo.active,
                });
            } else {
                navigate("/admin/combo");
            }
        }
    }, [id, isEditing, navigate]);

    // Calculate original price from items
    const calculatedOriginalPrice = useMemo(() => {
        return comboService.calculateOriginalPrice(formData.items);
    }, [formData.items]);

    // Update original price when items change
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            originalPrice: calculatedOriginalPrice,
        }));
    }, [calculatedOriginalPrice]);

    // Calculate discount percent
    useEffect(() => {
        if (formData.originalPrice > 0 && formData.discountPrice > 0) {
            const percent = Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100);
            setFormData(prev => ({
                ...prev,
                discountPercent: Math.max(0, percent),
            }));
        }
    }, [formData.originalPrice, formData.discountPrice]);

    // Get items with details
    const itemsWithDetails: ComboItemWithDetails[] = useMemo(() => {
        return formData.items.map(item => {
            const product = productService.getById(item.productId);
            const variant = item.variantId
                ? product?.variants.find(v => v.id === item.variantId)
                : product?.variants[0];
            const price = product && variant
                ? product.price + variant.priceModifier
                : 0;
            return {
                ...item,
                product,
                variant,
                price,
                total: price * item.quantity,
            };
        });
    }, [formData.items]);

    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped: Record<string, Product[]> = {};
        products.forEach(product => {
            if (!grouped[product.categoryId]) {
                grouped[product.categoryId] = [];
            }
            grouped[product.categoryId].push(product);
        });
        return grouped;
    }, [products]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleProductSelect = (productId: string) => {
        const product = productService.getById(productId);
        setSelectedProduct(product);
        setNewItem({
            productId,
            variantId: product?.variants[0]?.id || "",
            quantity: 1,
        });
    };

    const handleAddItem = () => {
        if (!newItem.productId || !newItem.variantId) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn sản phẩm và biến thể",
                variant: "destructive",
            });
            return;
        }

        // Check if item already exists
        const existingIndex = formData.items.findIndex(
            item => item.productId === newItem.productId && item.variantId === newItem.variantId
        );

        if (existingIndex >= 0) {
            // Update quantity
            const updatedItems = [...formData.items];
            updatedItems[existingIndex].quantity += newItem.quantity;
            setFormData(prev => ({ ...prev, items: updatedItems }));
        } else {
            // Add new item
            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem],
            }));
        }

        // Reset selection
        setNewItem({
            productId: "",
            variantId: "",
            quantity: 1,
        });
        setSelectedProduct(null);
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleUpdateItemQuantity = (index: number, quantity: number) => {
        if (quantity < 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => i === index ? { ...item, quantity } : item),
        }));
    };

    const handleAddImage = () => {
        if (newImageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImageUrl.trim()],
            }));
            setNewImageUrl("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const result = comboSchema.safeParse({
            name: formData.name,
            description: formData.description,
            discountPrice: formData.discountPrice,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach(err => {
                if (err.path[0]) {
                    fieldErrors[err.path[0].toString()] = err.message;
                }
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        if (formData.images.length === 0) {
            setErrors({ images: "Vui lòng thêm ít nhất 1 hình ảnh" });
            setIsSubmitting(false);
            return;
        }

        if (formData.items.length === 0) {
            setErrors({ items: "Vui lòng thêm ít nhất 1 sản phẩm" });
            setIsSubmitting(false);
            return;
        }

        if (formData.discountPrice >= formData.originalPrice) {
            setErrors({ discountPrice: "Giá combo phải nhỏ hơn tổng giá gốc" });
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditing) {
                comboService.update(id, formData);
                toast({
                    title: "Đã cập nhật",
                    description: "Combo đã được cập nhật thành công",
                });
            } else {
                comboService.create(formData);
                toast({
                    title: "Đã thêm",
                    description: "Combo mới đã được thêm thành công",
                });
            }
            navigate("/admin/combo");
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra, vui lòng thử lại",
                variant: "destructive",
            });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="p-6 max-w-6xl">
            <Link to="/admin/combo" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
            </Link>

            <h1 className="text-3xl font-bold mb-8">
                {isEditing ? "Chỉnh sửa combo" : "Thêm combo mới"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Product Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Tên combo *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Nhập tên combo"
                                        className={errors.name ? "border-destructive" : ""}
                                    />
                                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="ten-combo"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Mô tả *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Mô tả chi tiết combo"
                                        rows={4}
                                        className={errors.description ? "border-destructive" : ""}
                                    />
                                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="active"
                                            checked={formData.active}
                                            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                        />
                                        <Label htmlFor="active">Đang bán</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="featured"
                                            checked={formData.featured}
                                            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                                        />
                                        <Label htmlFor="featured">Nổi bật</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hình ảnh</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}

                                <div className="flex gap-2">
                                    <Input
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="Nhập URL hình ảnh"
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={handleAddImage} variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Thêm
                                    </Button>
                                </div>

                                {formData.images.length > 0 && (
                                    <div className="flex gap-4 flex-wrap">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary">
                                                    <img src={image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Product Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Chọn sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                    <div className="md:col-span-2">
                                        <Label>Sản phẩm *</Label>
                                        <Select
                                            value={newItem.productId}
                                            onValueChange={handleProductSelect}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn sản phẩm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => {
                                                    const categoryProducts = productsByCategory[category.id] || [];
                                                    if (categoryProducts.length === 0) return null;

                                                    return (
                                                        <div key={category.id}>
                                                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                                                {category.name}
                                                            </div>
                                                            {categoryProducts.map((product) => (
                                                                <SelectItem key={product.id} value={product.id}>
                                                                    {product.name}
                                                                </SelectItem>
                                                            ))}
                                                        </div>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Biến thể *</Label>
                                        <Select
                                            value={newItem.variantId}
                                            onValueChange={(value) => setNewItem({ ...newItem, variantId: value })}
                                            disabled={!selectedProduct}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn biến thể" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedProduct?.variants.map((variant) => (
                                                    <SelectItem key={variant.id} value={variant.id}>
                                                        {variant.name} ({variant.stock} có sẵn)
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Số lượng</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={newItem.quantity}
                                                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleAddItem}
                                            disabled={!newItem.productId || !newItem.variantId}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Selected items list */}
                                {itemsWithDetails.length > 0 && (
                                    <div className="space-y-2 mt-4">
                                        <Label>Sản phẩm đã chọn ({itemsWithDetails.length})</Label>
                                        {itemsWithDetails.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                                                <div className="w-12 h-12 rounded overflow-hidden bg-secondary flex-shrink-0">
                                                    {item.product && (
                                                        <img
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium line-clamp-1">{item.product?.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.variant?.name} • {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">SL:</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleUpdateItemQuantity(index, Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </div>
                                                <div className="text-right min-w-[100px]">
                                                    <p className="font-medium">{formatPrice(item.total)}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-destructive flex-shrink-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Pricing Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Tổng kết giá
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm text-muted-foreground">Tổng giá gốc:</span>
                                        <span className="font-medium">{formatPrice(formData.originalPrice)}</span>
                                    </div>

                                    <div>
                                        <Label htmlFor="discountPrice">Giá combo (sau giảm) *</Label>
                                        <Input
                                            id="discountPrice"
                                            type="number"
                                            value={formData.discountPrice}
                                            onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                                            placeholder="0"
                                            className={errors.discountPrice ? "border-destructive" : ""}
                                        />
                                        {errors.discountPrice && <p className="text-sm text-destructive mt-1">{errors.discountPrice}</p>}
                                    </div>

                                    {formData.discountPercent > 0 && (
                                        <div className="p-3 bg-primary/10 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Giảm giá:</span>
                                                <Badge className="bg-primary text-lg px-3">
                                                    {formData.discountPercent}%
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tiết kiệm: {formatPrice(formData.originalPrice - formData.discountPrice)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Package className="h-4 w-4" />
                                        <span>{formData.items.length} sản phẩm</span>
                                    </div>
                                    {formData.items.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Tổng số lượng: {formData.items.reduce((sum, item) => sum + item.quantity, 0)} món
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Buttons */}
                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật combo" : "Tạo combo"}
                            </Button>
                            <Link to="/admin/combo" className="w-full">
                                <Button type="button" variant="outline" className="w-full">Hủy</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ComboForm;
