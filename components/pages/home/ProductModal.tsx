"use client";
import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Star, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { addFavorite, deleteFavorite, getFavorites } from '@/lib/api';

export default function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const { addToCart, openCart } = useCart();
  const isLoggedIn = !!(typeof window !== 'undefined' && localStorage.getItem('token'));

  console.log("🔍 ProductModal - product:", product);
  console.log("🔍 ProductModal - isOpen:", !!product);

  useEffect(() => {
    if (product && isLoggedIn) {
      console.log("🎯 ProductModal opened for product:", product._id);
      getFavorites()
        .then((data) => setFavorites(Array.isArray(data) ? data : data.data || []))
        .catch(() => setFavorites([])); // في حالة حدوث خطأ، نضع مصفوفة فارغة
      setReviews([
        { name: 'أحمد محمد', rating: 5, comment: 'منتج ممتاز جدًا!' },
        { name: 'سارة علي', rating: 4, comment: 'جودة جيدة وسعر مناسب.' },
      ]);
    } else if (product) {
      // إذا لم يكن المستخدم مسجل دخول، نضع مصفوفة فارغة
      setFavorites([]);
      setReviews([
        { name: 'أحمد محمد', rating: 5, comment: 'منتج ممتاز جدًا!' },
        { name: 'سارة علي', rating: 4, comment: 'جودة جيدة وسعر مناسب.' },
      ]);
    }
  }, [product?._id, isLoggedIn, product]);

  const isInFavorites = (productId: string) => favorites.some((fav) => fav._id === productId);

  const handleToggleFavorite = async () => {
    if (!product) return;
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
    } catch (e) {}
    setFavLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      _id: product._id || product.id,
      name: product?.title?.ar || product?.title?.en || 'اسم المنتج',
      price: product?.sale && product.sale > 0
        ? Number((product.price - (product.price * product.sale / 100)).toFixed(2))
        : product?.price || 0,
      image: (Array.isArray(product?.image) && product?.image[0]?.url) ? product.image[0].url : '/icons/products/1.png',
    });
    openCart();
  };

  const handleAddReview = (e: any) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviews([{ ...newReview }, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
  };

  const handleClose = () => {
    console.log("❌ ProductModal closing");
    onClose();
  };

  if (!product) {
    console.log("🚫 ProductModal: no product provided");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-2xl p-2 sm:p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <button 
          onClick={handleClose} 
          className="absolute left-3 top-3 text-gray-400 hover:text-red-500 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* صورة المنتج */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 mb-4 md:mb-0">
            <img
              src={product?.image?.[0]?.url || '/icons/products/1.png'}
              alt={product?.title?.ar || product?.title?.en || 'منتج'}
              className="object-contain rounded-lg border w-full max-w-[220px] sm:max-w-xs bg-gray-50 p-2"
            />
          </div>
          
          {/* تفاصيل المنتج */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 justify-center">
            <h1 className="text-xl md:text-3xl font-bold text-primary mb-1 line-clamp-2">
              {product?.title?.ar || product?.title?.en || 'اسم المنتج'}
            </h1>
            
            <div className="flex items-center gap-4 mb-1 flex-wrap">
              <span className="text-2xl font-bold text-green-600">
                {product?.sale && product.sale > 0
                  ? `${(product.price - (product.price * product.sale / 100)).toFixed(2)}`
                  : product?.price || '0'
                } د.ك
              </span>
              {product?.sale && product.sale > 0 && (
                <span className="text-lg text-red-500 line-through">{product?.price} د.ك</span>
              )}
            </div>
            
            <div className="text-gray-600 mb-1 text-base">
              الكمية المتاحة: <span className="font-bold">{product?.quantity || 1}</span>
            </div>
            
            <div className="text-gray-700 mb-1 text-base line-clamp-3">
              {product?.desc?.ar || product?.desc?.en || 'لا يوجد وصف لهذا المنتج.'}
            </div>
            
            {/* الأزرار */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                className="w-full h-12 bg-primary hover:bg-yellow-400 text-white font-bold rounded-lg transition-colors text-lg flex items-center justify-center gap-3 shadow text-center"
                style={{ fontSize: '1.1rem' }}
              >
                <ShoppingCart className="w-6 h-6" />
                أضف إلى السلة
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className={`w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-lg transition-colors text-lg flex items-center justify-center gap-3 shadow text-center ${isInFavorites(product._id) ? 'bg-yellow-100' : ''}`}
                style={{ fontSize: '1.1rem' }}
                disabled={favLoading}
              >
                <Heart className="w-6 h-6" />
                {isInFavorites(product._id) ? 'إزالة من المفضلة' : 'أضف إلى المفضلة'}
              </button>
            </div>
            
            {/* قسم التقييمات */}
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                مراجعات العملاء
              </h2>
              
              {/* متوسط التقييم وعدد التقييمات */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-yellow-500">
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                </span>
                <span className="text-gray-500 text-base">من 5</span>
                <span className="text-gray-400 text-xs">({reviews.length} تقييم)</span>
              </div>
              
              {/* شريط التقييمات */}
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const percent = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-6">{star}★</span>
                    <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                      <div style={{ width: `${percent}%` }} className="bg-yellow-400 h-2"></div>
                    </div>
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                );
              })}
              
              {/* إضافة تقييم */}
              <form onSubmit={handleAddReview} className="mb-4 flex flex-col md:flex-row gap-2 items-center mt-4">
                <input
                  type="text"
                  placeholder="اسمك"
                  className="border rounded px-2 py-1 w-full md:w-1/4 text-sm"
                  value={newReview.name}
                  onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                  required
                />
                <select
                  className="border rounded px-2 py-1 w-full md:w-1/6 text-sm"
                  value={newReview.rating}
                  onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} نجوم</option>)}
                </select>
                <input
                  type="text"
                  placeholder="تعليقك"
                  className="border rounded px-2 py-1 w-full md:w-2/4 text-sm"
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
                <button type="submit" className="bg-primary text-white rounded px-3 py-1 text-sm">
                  إضافة تقييم
                </button>
              </form>
            </div>
            
            {/* قسم الحماية */}
            <div className="border rounded-lg p-2 mt-2 bg-gray-50 text-xs max-w-xs mx-auto">
              <div className="font-bold mb-1 text-sm">حماية لهذا المنتج</div>
              <div className="flex items-start gap-1 mb-1">
                <span className="text-primary text-base">🛡️</span>
                <div>
                  <span className="font-bold text-xs">دفع آمن</span>
                  <div className="text-[10px] text-gray-600">
                    نستخدم تشفيرًا متقدمًا لحماية معلومات الدفع الخاصة بك أثناء عملية الشراء.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-primary text-base">💸</span>
                <div>
                  <span className="font-bold text-xs">سياسة الاسترجاع</span>
                  <div className="text-[10px] text-gray-600">
                    نؤمن برضا العملاء. إذا احتجت لإرجاع المنتج، سياستنا واضحة وسهلة لاسترداد كامل المبلغ.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 