import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
    fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().trim().email("Email không hợp lệ"),
    phone: z.string().trim().regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    subject: z.string().trim().min(5, "Chủ đề phải có ít nhất 5 ký tự"),
    message: z.string().trim().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

const Contact = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const result = contactSchema.safeParse(formData);
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

        // Simulate sending message
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Gửi tin nhắn thành công!",
            description: "Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.",
        });

        // Reset form
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
        setIsSubmitting(false);
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Bạn có câu hỏi hoặc cần hỗ trợ? Hãy gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Contact Form - Left Side (2 columns) */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Gửi tin nhắn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <Label htmlFor="fullName">Họ và tên *</Label>
                                        <Input
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => handleChange("fullName", e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            className={errors.fullName ? "border-destructive" : ""}
                                        />
                                        {errors.fullName && (
                                            <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                placeholder="example@email.com"
                                                className={errors.email ? "border-destructive" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-destructive mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Số điện thoại *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                placeholder="0909123456"
                                                className={errors.phone ? "border-destructive" : ""}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <Label htmlFor="subject">Chủ đề *</Label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) => handleChange("subject", e.target.value)}
                                            placeholder="Tôi muốn hỏi về..."
                                            className={errors.subject ? "border-destructive" : ""}
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <Label htmlFor="message">Nội dung *</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => handleChange("message", e.target.value)}
                                            placeholder="Nhập nội dung tin nhắn của bạn..."
                                            rows={6}
                                            className={errors.message ? "border-destructive" : ""}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                        <Send className="h-4 w-4 mr-2" />
                                        {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Store Information - Right Side */}
                    <div className="space-y-6">
                        {/* Contact Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin liên hệ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Address */}
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Địa chỉ</h3>
                                        <p className="text-sm text-muted-foreground">
                                            123 Nguyễn Huệ, Quận 1<br />
                                            TP. Hồ Chí Minh
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Hotline</h3>
                                        <p className="text-sm text-muted-foreground">
                                            1900 xxxx (24/7)<br />
                                            0909 123 456
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-sm text-muted-foreground">
                                            contact@noelshop.vn<br />
                                            support@noelshop.vn
                                        </p>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Thứ 2 - Thứ 6: 8:00 - 20:00<br />
                                            Thứ 7 - Chủ nhật: 9:00 - 21:00
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Theo dõi chúng tôi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z" />
                                        </svg>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Kết nối với chúng tôi trên mạng xã hội để cập nhật thông tin mới nhất
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;
