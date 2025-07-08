  import axios from "axios";


const API_BASE = "http://46.202.159.197:4000/api/vi/auth";
const API_CATEGORY = "http://46.202.159.197:4000/api/vi/category";
const API_PRODUCT = "http://46.202.159.197:4000/api/vi/product";

// دالة مساعدة للحصول على headers المصادقة
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("لم يتم العثور على توكن تسجيل الدخول");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
}

export async function register({ username, email, password }: { username: string; email: string; password: string }) {
  try {
    
    const response = await axios.post(`${API_BASE}/register`, {
      username,
      email,
      password,
    });
    
    
    // حفظ التوكن في localStorage إذا كان موجوداً (في حالة التسجيل مع تسجيل الدخول التلقائي)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // إرسال حدث لتحديث حالة تسجيل الدخول في المكونات الأخرى
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    
    return response.data;
  } catch (error: any) {
    
    if (error.response) {
      const message = error.response.data?.message || "فشل التسجيل";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء التأكد من تشغيل الخادم والمحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

export async function login({ login, password }: { login: string; password: string }) {
  try {
    
    const response = await axios.post(`${API_BASE}/login`, {
      email: login,
      password,
    });
    
    
    // حفظ التوكن في localStorage إذا كان موجوداً
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // إرسال حدث لتحديث حالة تسجيل الدخول في المكونات الأخرى
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    
    return response.data;
  } catch (error: any) {
    
    if (error.response) {
      const message = error.response.data?.message || "فشل تسجيل الدخول";

      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}


export async function getAllCategories() {
  try {
    const response = await axios.get(API_CATEGORY);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب التصنيفات");
  }
}


export async function addCategory(category: { name: string; parentId?: string }) {
  try {
    const response = await axios.post(API_CATEGORY, category);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل إضافة التصنيف");
  }
}


export async function deleteCategory(id: string) {
  try {
    const response = await axios.delete(`${API_CATEGORY}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل حذف التصنيف");
  }
}


export async function getCategory(id: string) {
  try {
    const response = await axios.get(`${API_CATEGORY}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب التصنيف");
  }
}

// ==================== PRODUCTS API ====================


export async function getAllProducts() {
  try {
    const response = await axios.get(API_PRODUCT);

    let products = [];
    if (Array.isArray(response.data)) {
      products = response.data;
    } else if (Array.isArray(response.data?.data)) {
      products = response.data.data;
    } else {
    }

    return products;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب المنتجات");
  }
}

export async function addProduct(product: {
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  category: string;
  price: number;
  review?: number;
  sale?: number;
  image: Array<{ public_id: string; url: string }>;
}) {
  try {
    const response = await axios.post(API_PRODUCT, product);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل إضافة المنتج");
  }
}


export async function deleteProduct(id: string) {
  try {
    const response = await axios.delete(`${API_PRODUCT}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل حذف المنتج");
  }
}


export async function updateProduct(id: string, product: {
  title?: { ar: string; en: string };
  desc?: { ar: string; en: string };
  category?: string;
  price?: number;
  review?: number;
  sale?: number;
  image?: Array<{ public_id: string; url: string }>;
}) {
  try {
    const response = await axios.put(`${API_PRODUCT}/${id}`, product);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل تحديث المنتج");
  }
}

export async function getProduct(id: string) {
  try {
    const response = await axios.get(`${API_PRODUCT}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب المنتج");
  }
}

// ==================== HERO BANNER API ====================

const API_HERO = "http://46.202.159.197:4000/api/v1/hero";

export async function getHeroBanner() {
  try {
    console.log("Fetching hero banner from:", `${API_HERO}/get/`);
    const response = await axios.get(`${API_HERO}/get/`);
    console.log("Hero banner response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Hero banner error:", error);
    throw new Error(error.response?.data?.message || "فشل جلب البنر الإعلاني");
  }
}

export async function addHeroBanner(data: { image: File | string, url: string }) {
  try {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('url', data.url);
    const response = await axios.post(`${API_HERO}/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل إضافة البنر الإعلاني");
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    const response = await axios.delete(`${API_HERO}/delete/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل حذف البنر الإعلاني");
  }
}

export async function searchProducts(query: string) {
  try {
    const response = await fetch(`http://46.202.159.197:4000/api/vi/search/?name=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

// ==================== GOOGLE OAUTH API ====================

export const initiateGoogleAuth = () => {
  // حفظ الصفحة الحالية للعودة إليها بعد تسجيل الدخول
  const currentPath = window.location.pathname;
  if (currentPath !== '/login') {
    localStorage.setItem('returnUrl', currentPath);
  }
  
  window.location.href = `${API_BASE}/google`;
};

export const handleGoogleCallback = async (code: string) => {
  try {
    console.log('Handling Google callback with code:', code);
    
    const response = await axios.post(`${API_BASE}/google/callback`, {
      code: code
    });
    
    console.log('Google callback response:', response.data);
    
    // حفظ التوكن في localStorage إذا كان موجوداً
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Google token saved to localStorage');
      
      // إرسال حدث لتحديث حالة تسجيل الدخول في المكونات الأخرى
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Google callback error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || "فشل تسجيل الدخول بواسطة Google";
      console.error('Server error response:', error.response.data);
      throw new Error(message);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      console.error('Request setup error:', error.message);
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
};

// ==================== AUTH UTILITIES ====================

export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // تحقق من أن التوكن موجود وله طول معقول
    if (token.length < 10) return false;
    
    // تحقق من أن التوكن ليس فارغاً أو "undefined" أو "null"
    if (token === 'undefined' || token === 'null' || token.trim() === '') return false;
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('returnUrl');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  
  // إرسال حدث لتحديث حالة تسجيل الدخول في المكونات الأخرى
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authStateChanged'));
  }
};

// ==================== FAVORITES API ====================

const API_FAVORITES = "http://46.202.159.197:4000/api/vi/favorites";

export async function addFavorite(productId: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    // جلب userId من بيانات المستخدم
    const currentUser = await getCurrentUser();
    const userId = currentUser._id || currentUser.id;
    if (!userId) throw new Error("لم يتم العثور على معرف المستخدم");
    // إرسال user و product معاً
    const response = await axios.post(
      `${API_FAVORITES}/add`,
      { user: userId, product: productId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    //console.error("خطأ إضافة للمفضلة:", error.response?.data || error.message);
    if (error.response) {
      const message = error.response.data?.message || error.response.data || "فشل إضافة المنتج إلى المفضلة";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

export async function getFavorites() {
  try {
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    
    const response = await axios.get(API_FAVORITES, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    
    if (error.response) {
      // إذا كان الخطأ يشير إلى عدم وجود عناصر مفضلة، نعيد مصفوفة فارغة
      if (error.response.data?.message?.includes("No favorite items found") || 
          error.response.data?.message?.includes("لا توجد عناصر مفضلة")) {
        return [];
      }
      
      // الخادم رد بخطأ آخر
      const message = error.response.data?.message || error.response.data || "فشل جلب المفضلة";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

export async function deleteFavorite(favoriteId: string) {
  try {
    
    const response = await axios.delete(`${API_FAVORITES}/${favoriteId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    // إذا كان الحذف ناجح من الواجهة الأمامية، لا نعرض خطأ
    // فقط نرمي خطأ بسيط بدون تفاصيل
    throw new Error(error.response?.data?.message || "فشل حذف المنتج من المفضلة");
  }
}

// ==================== RESET PASSWORD API ====================

// إرسال الإيميل واستقبال التوكن
export async function resetPasswordRequest(email: string) {
  try {
    const response = await axios.post(`${API_BASE}/reset-password`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل إرسال رابط إعادة تعيين كلمة المرور");
  }
}

// إعادة تعيين كلمة المرور
export async function resetPasswordConfirm({ email, code, newPassword }: { email: string; code: string; newPassword: string }) {
  try {
    const response = await axios.post(`${API_BASE}/verify-reset-code`, { email, code, newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل إعادة تعيين كلمة المرور");
  }
}

// ==================== USERS API ====================

const API_USERS = "http://46.202.159.197:4000/api/vi/users";

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    const response = await axios.get(`${API_USERS}/token?Au`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("بيانات المستخدم من السيرفر:", response.data);
    if (response.data?.user) {
      return response.data.user;
    }
    if (response.data?.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || "فشل جلب بيانات المستخدم";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}
export async function getUserById(id: string) {
  try {
    const response = await axios.get(`${API_USERS}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب بيانات المستخدم");
  }
}


export async function getAllUsers() {
  try {
    const response = await axios.get(API_USERS, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب المستخدمين");
  }
}


export async function updateUser(userData: {
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    
    const currentUser = await getCurrentUser();
    const userId = currentUser._id;
    
    const response = await axios.put(`${API_USERS}/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || "فشل تحديث بيانات المستخدم";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

export async function deleteUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    
    const currentUser = await getCurrentUser();
    const userId = currentUser._id;
    
    const response = await axios.delete(`${API_USERS}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || "فشل حذف المستخدم";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

// ==================== LOGOUT API ====================

export async function logout() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // إذا لم يكن هناك توكن، نعتبر تسجيل الخروج ناجح
      clearAuthData();
      return { message: "تم تسجيل الخروج بنجاح" };
    }
    
    // محاولة إرسال طلب تسجيل الخروج للخادم (اختياري)
    try {
      await axios.post(`${API_BASE}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (serverError) {
      // حتى لو فشل الطلب للخادم، نكمل تسجيل الخروج محلياً
      console.warn("فشل في إرسال طلب تسجيل الخروج للخادم:", serverError);
    }
    
    // مسح البيانات المحلية
    clearAuthData();
    
    return { message: "تم تسجيل الخروج بنجاح" };
  } catch (error: any) {
    // في حالة حدوث خطأ، نمسح البيانات المحلية على أي حال
    clearAuthData();
    
    if (error.response) {
      const message = error.response.data?.message || "فشل تسجيل الخروج";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

// ==================== ORDER API ====================

const API_ORDER = "http://46.202.159.197:4000/api/vi/order";

// إضافة منتج إلى السلة
export async function addToOrder(productId: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }

    const response = await axios.post(`${API_ORDER}/add`, {
      product: productId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Order added successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add to order error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || "فشل إضافة المنتج إلى السلة";
      console.error('Server error response:', error.response.data);
      throw new Error(message);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      console.error('Request setup error:', error.message);
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

// جلب منتجات السلة للمستخدم
export async function getUserOrders() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }

    const response = await axios.get(`${API_ORDER}/userorder`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('User orders fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get user orders error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || "فشل جلب منتجات السلة";
      console.error('Server error response:', error.response.data);
      throw new Error(message);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      console.error('Request setup error:', error.message);
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

// حذف منتج من السلة
export async function deleteOrder(orderId: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }

    const response = await axios.delete(`${API_ORDER}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Order deleted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Delete order error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || "فشل حذف المنتج من السلة";
      console.error('Server error response:', error.response.data);
      throw new Error(message);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      console.error('Request setup error:', error.message);
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}


