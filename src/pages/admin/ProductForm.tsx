import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon 
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
import { useToast } from "@/hooks/use-toast";
import { productService, categoryService } from "@/services";
import { Product, ProductVariant, Category } from "@/types";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().trim().min(2, "Tên sản phẩm phải có ít nhất 2 ký tự").max(200),
  description: z.string().trim().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  price: z.number().min(1000, "Giá phải lớn hơn 1,000đ"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
});

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditing = id && id !== "them";

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
    variants: ProductVariant[];
    featured: boolean;
    active: boolean;
  }>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    categoryId: "",
    images: [],
    variants: [],
    featured: false,
    active: true,
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVariant, setNewVariant] = useState<{
    name: string;
    type: 'color' | 'size';
    value: string;
    stock: number;
    priceModifier: number;
  }>({
    name: "",
    type: "color",
    value: "",
    stock: 0,
    priceModifier: 0,
  });

  useEffect(() => {
    setCategories(categoryService.getAll());

    if (isEditing) {
      const product = productService.getById(id);
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          images: product.images,
          variants: product.variants,
          featured: product.featured,
          active: product.active,
        });
      } else {
        navigate("/admin/san-pham");
      }
    }
  }, [id, isEditing, navigate]);

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

  const handleAddVariant = () => {
    if (newVariant.name.trim()) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant, id: crypto.randomUUID() }],
      }));
      setNewVariant({
        name: "",
        type: "color",
        value: "",
        stock: 0,
        priceModifier: 0,
      });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateVariantStock = (index: number, stock: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, stock } : v),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = productSchema.safeParse({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      categoryId: formData.categoryId,
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

    if (formData.variants.length === 0) {
      setErrors({ variants: "Vui lòng thêm ít nhất 1 biến thể" });
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        productService.update(id, formData);
        toast({
          title: "Đã cập nhật",
          description: "Sản phẩm đã được cập nhật thành công",
        });
      } else {
        productService.create(formData);
        toast({
          title: "Đã thêm",
          description: "Sản phẩm mới đã được thêm thành công",
        });
      }
      navigate("/admin/san-pham");
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
    <div className="p-6 max-w-4xl">
      <Link to="/admin/san-pham" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại danh sách
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên sản phẩm"
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
                placeholder="ten-san-pham"
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết sản phẩm"
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Giá gốc (VND) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="100000"
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="category">Danh mục *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-destructive mt-1">{errors.categoryId}</p>}
              </div>
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

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Biến thể (Màu sắc / Kích thước)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.variants && <p className="text-sm text-destructive">{errors.variants}</p>}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Input
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                placeholder="Tên (VD: Đỏ)"
              />
              <Select
                value={newVariant.type}
                onValueChange={(value: 'color' | 'size') => setNewVariant({ ...newVariant, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Màu sắc</SelectItem>
                  <SelectItem value="size">Kích thước</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                placeholder="Tồn kho"
              />
              <Input
                type="number"
                value={newVariant.priceModifier}
                onChange={(e) => setNewVariant({ ...newVariant, priceModifier: Number(e.target.value) })}
                placeholder="Thay đổi giá"
              />
              <Button type="button" onClick={handleAddVariant} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.variants.length > 0 && (
              <div className="space-y-2">
                {formData.variants.map((variant, index) => (
                  <div key={variant.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{variant.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({variant.type === 'color' ? 'Màu' : 'Size'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Tồn kho:</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleUpdateVariantStock(index, Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {variant.priceModifier !== 0 && (
                        <span>
                          {variant.priceModifier > 0 ? '+' : ''}{variant.priceModifier.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link to="/admin/san-pham">
            <Button type="button" variant="outline">Hủy</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
