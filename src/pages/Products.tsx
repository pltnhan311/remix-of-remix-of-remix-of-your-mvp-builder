import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { productService, categoryService } from "@/services";
import { formatPrice } from "@/lib/format";
import { Category } from "@/types";

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = categoryService.getAll();

  // Filter products
  const filteredProducts = useMemo(() => {
    const result = productService.filter({
      search: searchQuery || undefined,
      categoryId: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 2000000 ? priceRange[1] : undefined,
      active: true,
    }, 1, 1000);

    // Filter by multiple categories if needed
    let products = result.data;
    if (selectedCategories.length > 1) {
      products = products.filter(p => selectedCategories.includes(p.categoryId));
    }

    return products;
  }, [searchQuery, selectedCategories, priceRange]);

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, priceRange]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategories, setSearchParams]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, 2000000]);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category: Category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label htmlFor={category.id} className="cursor-pointer text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Khoảng giá</h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={2000000}
          step={50000}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <span className="text-foreground">Sản phẩm</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Sản phẩm</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} sản phẩm được tìm thấy
            </p>
          </div>

          {/* Search & Filter Toggle (Mobile) */}
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Bộ lọc</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-lg p-6 border">
              <h2 className="font-bold text-lg mb-4">Bộ lọc</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                    Tìm: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategories.map(catId => {
                  const cat = categories.find((c: Category) => c.id === catId);
                  return cat ? (
                    <span key={catId} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                      {cat.name}
                      <button onClick={() => handleCategoryToggle(catId)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Products */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎄</div>
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted-foreground mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
