import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { comboService } from "@/services";
import { formatPrice } from "@/lib/format";
import { Combo } from "@/types";

const ComboList = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [combos, setCombos] = useState<Combo[]>(comboService.getAll());

  const filteredCombos = useMemo(() => {
    if (!search.trim()) return combos;
    const searchLower = search.toLowerCase();
    return combos.filter(c => c.name.toLowerCase().includes(searchLower));
  }, [combos, search]);

  const handleDelete = (comboId: string) => {
    const success = comboService.delete(comboId);
    if (success) {
      setCombos(comboService.getAll());
      toast({
        title: "Đã xóa combo",
        description: "Combo đã được xóa thành công",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Không thể xóa combo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Combo</h1>
          <p className="text-muted-foreground">{combos.length} combo</p>
        </div>
        <Link to="/admin/combo/them">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm combo
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm combo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      {filteredCombos.length === 0 ? (
        <div className="text-center py-16">
          <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Không có combo</h2>
          <p className="text-muted-foreground mb-6">
            {search ? "Không tìm thấy combo phù hợp" : "Hãy tạo combo đầu tiên"}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead>Tên combo</TableHead>
                <TableHead className="text-center">Số SP</TableHead>
                <TableHead className="text-right">Giá gốc</TableHead>
                <TableHead className="text-right">Giá combo</TableHead>
                <TableHead className="text-center">Giảm</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCombos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                      <img src={combo.images[0]} alt={combo.name} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium line-clamp-1">{combo.name}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {combo.items.length}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground line-through">
                    {formatPrice(combo.originalPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {formatPrice(combo.discountPrice)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-primary">{combo.discountPercent}%</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {combo.active ? (
                      <Badge className="bg-green-100 text-green-800">Đang bán</Badge>
                    ) : (
                      <Badge variant="secondary">Ẩn</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/combo/${combo.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa combo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa "{combo.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(combo.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ComboList;
