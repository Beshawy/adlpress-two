  import axios from "axios";


const API_BASE = "http://46.202.159.197:4000/api/vi/auth";
const API_CATEGORY = "http://46.202.159.197:4000/api/vi/category";
const API_PRODUCT = "http://46.202.159.197:4000/api/vi/product";

export async function register({ username, email, password }: { username: string; email: string; password: string }) {
  try {
    console.log('Sending registration request to:', `${API_BASE}/register`);
    console.log('With data:', { username, email });
    
    const response = await axios.post(`${API_BASE}/register`, {
      username,
      email,
      password,
    });
    
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || "فشل التسجيل";
      console.error('Server error response:', error.response.data);
      throw new Error(message);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء التأكد من تشغيل الخادم والمحاولة مرة أخرى.");
    } else {
      console.error('Request setup error:', error.message);
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

export async function login({ login, password }: { login: string; password: string }) {
  try {
    console.log('Sending login request to:', `${API_BASE}/login`);
    console.log('With data:', { email: login });
    
    const response = await axios.post(`${API_BASE}/login`, {
      email: login,
      password,
    });
    
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || "فشل تسجيل الدخول";
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
      console.error("⚠️ لم يتم جلب منتجات أو البيانات ليست مصفوفة صحيحة!");
    }

    return products;
  } catch (error: any) {
    console.error("❌ خطأ أثناء جلب المنتجات:", error);
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

// ==================== ORDERS API ====================

const API_ORDER = "http://46.202.159.197:4000/api/vi/order"

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export async function addOrder(orderData: { product: string }) {
  try {
    const response = await axios.post(`${API_ORDER}/add`, orderData, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل إضافة الطلب");
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const response = await axios.delete(`${API_ORDER}/${orderId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل حذف الطلب");
  }
}

export async function getUserOrders() {
  try {
    const response = await axios.get(`${API_ORDER}/userorder`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "فشل جلب طلبات المستخدم");
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
    return token.length > 10;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('returnUrl');
};

// ==================== FAVORITES API ====================

const API_FAVORITES = "http://46.202.159.197:4000/api/vi/favorites";

export async function addFavorite(productId: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    // لا ترسل userId في البودي، السيرفر يستخرج المستخدم من التوكن
    const response = await axios.post(
      `${API_FAVORITES}/add`,
      { product: productId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error("خطأ إضافة للمفضلة:", error.response?.data || error.message);
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
      // الخادم رد بخطأ
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
    console.error('خطأ في حذف من المفضلة - تفاصيل:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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
      const message = error.response.data?.message || "فشل حذف الحساب";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("لم نتمكن من الوصول للخادم. الرجاء المحاولة مرة أخرى.");
    } else {
      throw new Error("حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.");
    }
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("لم يتم العثور على توكن تسجيل الدخول");
    }
    
    const response = await axios.get(`${API_BASE}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    clearAuthData();
    
    return response.data;
  } catch (error: any) {
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





