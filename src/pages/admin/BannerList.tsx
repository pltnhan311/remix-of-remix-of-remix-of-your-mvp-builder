import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { bannerService } from "@/services";
import { Banner } from "@/types";

const BannerList = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(bannerService.getAll());
  const [newBanner, setNewBanner] = useState({ title: "", subtitle: "", image: "", link: "" });

  const handleAdd = () => {
    if (!newBanner.title.trim() || !newBanner.image.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề và URL ảnh", variant: "destructive" });
      return;
    }
    bannerService.create({ ...newBanner, order: banners.length, active: true });
    setBanners(bannerService.getAll());
    setNewBanner({ title: "", subtitle: "", image: "", link: "" });
    toast({ title: "Đã thêm", description: "Banner mới đã được thêm" });
  };

  const handleToggle = (id: string, active: boolean) => {
    bannerService.update(id, { active });
    setBanners(bannerService.getAll());
  };

  const handleDelete = (id: string) => {
    bannerService.delete(id);
    setBanners(bannerService.getAll());
    toast({ title: "Đã xóa", description: "Banner đã được xóa" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Quản lý Banner</h1>

      {/* Add New */}
      <Card className="mb-8">
        <CardHeader><CardTitle>Thêm banner mới</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tiêu đề *</Label>
              <Input value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })} placeholder="Tiêu đề banner" />
            </div>
            <div>
              <Label>Phụ đề</Label>
              <Input value={newBanner.subtitle} onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })} placeholder="Phụ đề" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>URL Ảnh *</Label>
              <Input value={newBanner.image} onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>Link (tùy chọn)</Label>
              <Input value={newBanner.link} onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })} placeholder="/san-pham" />
            </div>
          </div>
          <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Thêm banner</Button>
        </CardContent>
      </Card>

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border">
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{banner.title}</p>
              {banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}
            </div>
            <Switch checked={banner.active} onCheckedChange={(checked) => handleToggle(banner.id, checked)} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa banner?</AlertDialogTitle>
                  <AlertDialogDescription>Bạn có chắc chắn muốn xóa banner này?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(banner.id)} className="bg-destructive">Xóa</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerList;
