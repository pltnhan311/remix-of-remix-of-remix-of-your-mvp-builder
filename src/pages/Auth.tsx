import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  emailOrPhone: z.string().trim().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100),
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z.string().trim().regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register form
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginErrors({});

    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setLoginErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const loginResult = authService.login(loginData.emailOrPhone, loginData.password);
    
    if (loginResult.success) {
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${loginResult.user?.fullName}!`,
      });
      navigate("/");
    } else {
      setLoginErrors({ general: loginResult.error || "Đăng nhập thất bại" });
    }

    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegisterErrors({});

    const result = registerSchema.safeParse(registerData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setRegisterErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const registerResult = authService.register({
      fullName: registerData.fullName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
    });

    if (registerResult.success) {
      toast({
        title: "Đăng ký thành công",
        description: `Chào mừng ${registerResult.user?.fullName}!`,
      });
      navigate("/");
    } else {
      setRegisterErrors({ general: registerResult.error || "Đăng ký thất bại" });
    }

    setIsSubmitting(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </Link>

          {/* Auth Card */}
          <div className="bg-card rounded-2xl border p-8">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🎄</span>
              <h1 className="text-2xl font-bold">Noel Shop</h1>
              <p className="text-muted-foreground">Đăng nhập hoặc tạo tài khoản mới</p>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginErrors.general && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {loginErrors.general}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="login-email">Email hoặc Số điện thoại</Label>
                    <Input
                      id="login-email"
                      value={loginData.emailOrPhone}
                      onChange={(e) => setLoginData({ ...loginData, emailOrPhone: e.target.value })}
                      placeholder="email@example.com hoặc 0909123456"
                      className={loginErrors.emailOrPhone ? "border-destructive" : ""}
                    />
                    {loginErrors.emailOrPhone && (
                      <p className="text-sm text-destructive mt-1">{loginErrors.emailOrPhone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="••••••"
                        className={loginErrors.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-sm text-destructive mt-1">{loginErrors.password}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Tài khoản demo: admin@noelshop.vn / 123456</p>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  {registerErrors.general && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {registerErrors.general}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="register-name">Họ và tên</Label>
                    <Input
                      id="register-name"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className={registerErrors.fullName ? "border-destructive" : ""}
                    />
                    {registerErrors.fullName && (
                      <p className="text-sm text-destructive mt-1">{registerErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="email@example.com"
                      className={registerErrors.email ? "border-destructive" : ""}
                    />
                    {registerErrors.email && (
                      <p className="text-sm text-destructive mt-1">{registerErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-phone">Số điện thoại</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="0909123456"
                      className={registerErrors.phone ? "border-destructive" : ""}
                    />
                    {registerErrors.phone && (
                      <p className="text-sm text-destructive mt-1">{registerErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="••••••"
                        className={registerErrors.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-sm text-destructive mt-1">{registerErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-confirm">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="register-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="••••••"
                        className={registerErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {registerErrors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">{registerErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;
