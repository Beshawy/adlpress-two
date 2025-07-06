"use client";
import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { addFavorite, deleteFavorite, getFavorites } from '@/lib/api';

export default function ProductDetails({ product, onClose }: { product: any, onClose: () => void }) {
  const { addToCart, openCart } = useCart();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const isLoggedIn = !!(typeof window !== 'undefined' && localStorage.getItem('token'));

  console.log("🔍 ProductDetails - تم استدعاؤه");
  console.log("🔍 ProductDetails - product:", product);
  console.log("🔍 ProductDetails - isOpen:", !!product);

  useEffect(() => {
    if (product && isLoggedIn) {
      console.log("🎯 ProductDetails opened for product:", product._id);
      getFavorites()
        .then((data) => setFavorites(Array.isArray(data) ? data : data.data || []))
        .catch(() => setFavorites([])); // في حالة حدوث خطأ، نضع مصفوفة فارغة
    } else if (product) {
      // إذا لم يكن المستخدم مسجل دخول، نضع مصفوفة فارغة
      setFavorites([]);
    }
  }, [product?._id, isLoggedIn, product]);

  if (!product) {
    console.log("🚫 ProductDetails: لا يوجد منتج");
    return null;
  }

  console.log("✅ ProductDetails: سيتم عرض النافذة");

  const isInFavorites = (productId: string) => favorites.some((fav) => fav._id === productId);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }
    
    addToCart({
      _id: product._id || product.id,
      name: product?.title?.ar || product?.title?.en || 'اسم المنتج',
      price: product?.sale && product.sale > 0
        ? Number((product.price - (product.price * product.sale / 100)).toFixed(2))
        : product?.price || 0,
      image: (Array.isArray(product?.image) && product?.image[0]?.url) ? product.image[0].url : '/icons/products/1.png',
    });
    openCart();
    onClose(); // إغلاق نافذة التفاصيل بعد الإضافة للسلة
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }
    
    setFavLoading(true);
    try {
      if (isInFavorites(product._id)) {
        const fav = favorites.find((f) => f._id === product._id);
        if (fav) {
          await deleteFavorite(fav._id);
          const updated = await getFavorites();
          setFavorites(Array.isArray(updated) ? updated : updated.data || []);
        }
      } else {
        await addFavorite(product._id);
        const updated = await getFavorites();
        setFavorites(Array.isArray(updated) ? updated : updated.data || []);
      }
      
      // إرسال حدث لتحديث العداد في الهيدر
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    } catch (e) {
      // لا نعرض خطأ في console إذا كان الحذف/الإضافة ناجح من الواجهة الأمامية
    }
    setFavLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // إغلاق النافذة فقط إذا تم الضغط على الخلفية (backdrop) وليس على المحتوى
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-2 sm:p-4 w-[95%] sm:w-full max-w-2xl max-h-[85vh] sm:max-h-[70vh] overflow-y-auto mt-20 sm:mt-16">
        <button onClick={onClose} className="absolute right-2 sm:right-4 top-2 sm:top-4 text-gray-400 hover:text-red-500 z-10">
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
          {/* صورة المنتج */}
          <div className="flex-1 flex justify-center">
            <img
              src={product?.image?.[0]?.url || '/icons/products/1.png'}
              alt={product?.title?.ar || product?.title?.en || 'منتج'}
              className="object-contain rounded-lg border w-full max-w-[200px] sm:max-w-xs bg-gray-50 p-2 sm:p-4"
            />
          </div>
          
          {/* تفاصيل المنتج */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              {product?.title?.ar || product?.title?.en || 'اسم المنتج'}
            </h1>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-green-600">
                {product?.sale && product.sale > 0
                  ? `${(product.price - (product.price * product.sale / 100)).toFixed(2)}`
                  : product?.price || '0'
                } د.ك
              </span>
              {product?.sale && product.sale > 0 && (
                <span className="text-lg sm:text-xl text-red-500 line-through">{product?.price} د.ك</span>
              )}
            </div>
            
            <div className="text-sm sm:text-base text-gray-600">
              الكمية المتاحة: <span className="font-bold">{product?.quantity || 1}</span>
            </div>
            
            <div className="text-sm sm:text-base text-gray-700">
              {product?.desc?.ar || product?.desc?.en || 'لا يوجد وصف لهذا المنتج.'}
            </div>
            
            {/* الأزرار */}
            <div className="flex flex-col gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={handleAddToCart}
                className="w-full h-10 sm:h-12 bg-primary hover:bg-yellow-400 text-white font-bold rounded-lg transition-colors text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                أضف إلى السلة
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className={`w-full h-10 sm:h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-lg transition-colors text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 ${isInFavorites(product._id) ? 'bg-yellow-100' : ''}`}
                disabled={favLoading}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {isInFavorites(product._id) ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
              </button>
            </div>
            
            {/* التقييمات */}
            <div className="mt-4 sm:mt-6">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                تقييمات العملاء
              </h2>
              
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-yellow-500">4.5</span>
                <span className="text-sm sm:text-base text-gray-500">من 5</span>
                <span className="text-xs sm:text-sm text-gray-400">(12 تقييم)</span>
              </div>
              
              <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm w-4 sm:w-6">5★</span>
                  <div className="flex-1 bg-gray-200 rounded h-1.5 sm:h-2">
                    <div className="bg-yellow-400 h-1.5 sm:h-2 rounded" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm w-4 sm:w-6">4★</span>
                  <div className="flex-1 bg-gray-200 rounded h-1.5 sm:h-2">
                    <div className="bg-yellow-400 h-1.5 sm:h-2 rounded" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm w-4 sm:w-6">3★</span>
                  <div className="flex-1 bg-gray-200 rounded h-1.5 sm:h-2">
                    <div className="bg-yellow-400 h-1.5 sm:h-2 rounded" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm w-4 sm:w-6">2★</span>
                  <div className="flex-1 bg-gray-200 rounded h-1.5 sm:h-2">
                    <div className="bg-yellow-400 h-1.5 sm:h-2 rounded" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm w-4 sm:w-6">1★</span>
                  <div className="flex-1 bg-gray-200 rounded h-1.5 sm:h-2">
                    <div className="bg-yellow-400 h-1.5 sm:h-2 rounded" style={{ width: '0%' }}></div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">0</span>
                </div>
              </div>

              {/* إضافة تقييم جديد */}
              <div className="border-t pt-3 sm:pt-4">
                <h3 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3">أضف تقييمك</h3>
                <form className="space-y-2 sm:space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="اسمك"
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <select className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:border-primary">
                      <option value="">اختر عدد النجوم</option>
                      <option value="5">5 نجوم - ممتاز</option>
                      <option value="4">4 نجوم - جيد جداً</option>
                      <option value="3">3 نجوم - جيد</option>
                      <option value="2">2 نجوم - مقبول</option>
                      <option value="1">1 نجمة - ضعيف</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="اكتب تعليقك هنا..."
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    إرسال التقييم
                  </button>
                </form>
              </div>
            </div>
            
            {/* الحماية */}
            <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
              <div className="font-bold mb-2 text-sm sm:text-base">حماية لهذا المنتج</div>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-primary text-sm sm:text-base">🛡️</span>
                <div>
                  <span className="font-bold text-xs sm:text-sm">دفع آمن</span>
                  <div className="text-xs text-gray-600">تشفير متقدم لحماية معلومات الدفع</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary text-sm sm:text-base">💸</span>
                <div>
                  <span className="font-bold text-xs sm:text-sm">سياسة الاسترجاع</span>
                  <div className="text-xs text-gray-600">استرداد كامل المبلغ عند الإرجاع</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 