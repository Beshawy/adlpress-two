"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, Trash2, LogOut, Calendar, Mail, Phone, MapPin, Save, X } from "lucide-react";
import { getCurrentUser, updateUser, deleteUser, logout, isTokenValid } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<UserData>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      console.log("بيانات المستخدم في الصفحة:", userData);
      // إذا كان هناك username أو email اعتبر البيانات مكتملة
      if (!userData || (!userData.username && !userData.email)) {
        throw new Error("بيانات المستخدم غير مكتملة");
      }
      setUser(userData);
      setEditData({
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    } catch (error: any) {
      console.error("خطأ في جلب بيانات المستخدم:", error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes("توكن")) {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  // جلب بيانات المستخدم عند تحميل الصفحة أو عند تغيير التوكن
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !isTokenValid()) {
      router.push('/');
      return;
    }
    fetchUserData();
    // إعادة تحميل البيانات عند تغيير التوكن (مثلاً بعد تسجيل الدخول)
    // window.addEventListener("storage", ... ) يمكن إضافتها إذا أردت دعم التحديث الفوري بين التبويبات
  }, [fetchUserData, router]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // إعادة تعيين البيانات المحررة للبيانات الأصلية
    if (user) {
      setEditData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedUser = await updateUser(editData);
      setUser(updatedUser);
      setEditMode(false);
      toast({
        title: "تم التحديث",
        description: "تم تحديث بياناتك بنجاح",
      });
    } catch (error: any) {
      console.error("خطأ في تحديث البيانات:", error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteUser();
      toast({
        title: "تم الحذف",
        description: "تم حذف حسابك بنجاح",
      });
      router.push("/");
    } catch (error: any) {
      console.error("خطأ في حذف الحساب:", error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
      router.push("/");
    } catch (error: any) {
      let msg = "حدث خطأ غير متوقع أثناء تسجيل الخروج";
      if (error && typeof error.message === "string") {
        msg = error.message;
      }
      console.error("خطأ في تسجيل الخروج:", msg);
      toast({
        title: "خطأ",
        description: msg,
        variant: "destructive",
      });
      // حتى لو فشل الطلب، نعيد توجيه المستخدم
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.username) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">لم يتم العثور على بيانات المستخدم</h2>
            <p className="text-gray-600 mb-4">يرجى تسجيل الدخول مرة أخرى</p>
            <Button onClick={() => router.push("/")}>
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة بيانات حسابك الشخصي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* البطاقة الرئيسية للمعلومات */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">المعلومات الشخصية</CardTitle>
                    <CardDescription>بياناتك الشخصية الأساسية</CardDescription>
                  </div>
                  {!editMode && (
                    <Button onClick={handleEdit} variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* الصورة الشخصية */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.username || "مستخدم"} />
                    <AvatarFallback className="text-lg">
                      {(user.username || "م").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.username || "مستخدم"}</h3>
                    <Badge variant="secondary">عضو نشط</Badge>
                  </div>
                </div>

                <Separator />

                {/* معلومات المستخدم */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* اسم المستخدم */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center">
                      <User className="h-4 w-4 ml-2" />
                      اسم المستخدم
                    </Label>
                    {editMode ? (
                      <Input
                        id="username"
                        value={editData.username || ""}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                        placeholder="اسم المستخدم"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {user.username || "غير محدد"}
                      </p>
                    )}
                  </div>

                  {/* البريد الإلكتروني */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 ml-2" />
                      البريد الإلكتروني
                    </Label>
                    {editMode ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email || ""}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        placeholder="البريد الإلكتروني"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {user.email || "غير محدد"}
                      </p>
                    )}
                  </div>

                  {/* رقم الهاتف */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 ml-2" />
                      رقم الهاتف
                    </Label>
                    {editMode ? (
                      <Input
                        id="phone"
                        value={editData.phone || ""}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="رقم الهاتف"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {user.phone || "غير محدد"}
                      </p>
                    )}
                  </div>

                  {/* العنوان */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center">
                      <MapPin className="h-4 w-4 ml-2" />
                      العنوان
                    </Label>
                    {editMode ? (
                      <Input
                        id="address"
                        value={editData.address || ""}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        placeholder="العنوان"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {user.address || "غير محدد"}
                      </p>
                    )}
                  </div>
                </div>

                {/* تاريخ التسجيل */}
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Calendar className="h-4 w-4 ml-2" />
                    تاريخ التسجيل
                  </Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {user.createdAt ? formatDate(user.createdAt) : "غير متوفر"}
                  </p>
                </div>

                {/* أزرار التحرير */}
                {editMode && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 ml-2" />
                      {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      <X className="h-4 w-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* البطاقة الجانبية للإجراءات */}
          <div className="space-y-6">
            {/* إجراءات الحساب */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إجراءات الحساب</CardTitle>
                <CardDescription>إدارة حسابك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* تسجيل الخروج */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  {loggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                </Button>

                {/* حذف الحساب */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف الحساب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف حسابك نهائياً
                        وستفقد جميع بياناتك.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleting}
                      >
                        {deleting ? "جاري الحذف..." : "حذف الحساب"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* معلومات إضافية */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">آخر تحديث</span>
                  <span className="text-sm font-medium">
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">معرف المستخدم</span>
                  <span className="text-sm font-mono text-gray-500">
                    {user._id ? user._id.slice(-8) : "غير متوفر"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 