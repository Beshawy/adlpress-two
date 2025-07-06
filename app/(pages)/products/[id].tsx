"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllProducts, addFavorite, deleteFavorite, getFavorites } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [reviews, setReviews] = useState<any[]>([
    { name: "أحمد محمد", rating: 5, comment: "منتج ممتاز جدًا!" },
    { name: "سارة علي", rating: 4, comment: "جودة جيدة وسعر مناسب." },
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const { addToCart, openCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then((data) => {
        const found = Array.isArray(data) ? data.find((p) => p._id === id || p.id === id) : null;
        setProduct(found);
      })
      .catch((err) => setError(err.message || "فشل جلب المنتج"))
      .finally(() => setLoading(false));
    
    if (isLoggedIn) {
      getFavorites()
        .then((data) => setFavorites(Array.isArray(data) ? data : data.data || []))
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [id, isLoggedIn]);

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
      name: product?.title?.ar || product?.title?.en || "اسم المنتج",
      price: product?.sale && product.sale > 0
        ? Number((product.price - (product.price * product.sale / 100)).toFixed(2))
        : product?.price || 0,
      image: (Array.isArray(product?.image) && product?.image[0]?.url) ? product.image[0].url : "/icons/products/1.png",
    });
    openCart();
  };

  const handleAddReview = (e: any) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviews([{ ...newReview }, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  if (loading) return <div className="text-center py-20">جاري تحميل المنتج...</div>;
  if (error || !product) return <div className="text-center text-red-500 py-20">{error || "لم يتم العثور على المنتج"}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8 mb-16 flex flex-col md:flex-row gap-8">
      {/* صورة المنتج */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img
          src={product?.image?.[0]?.url || "/icons/products/1.png"}
          alt={product?.title?.ar || product?.title?.en || "منتج"}
          className="object-contain rounded-lg border w-full max-w-xs md:max-w-sm bg-gray-50 p-4"
        />
      </div>
      {/* تفاصيل المنتج */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{product?.title?.ar || product?.title?.en || "اسم المنتج"}</h1>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl font-bold text-green-600">
            {product?.sale && product.sale > 0
              ? `${(product.price - (product.price * product.sale / 100)).toFixed(2)}`
              : product?.price || "0"
            } د.ك
          </span>
          {product?.sale && product.sale > 0 && (
            <span className="text-base text-red-500 line-through">{product?.price} د.ك</span>
          )}
        </div>
        <div className="text-gray-600 mb-2">الكمية المتاحة: <span className="font-bold">{product?.quantity || 1}</span></div>
        <div className="text-gray-700 mb-2">{product?.desc?.ar || product?.desc?.en || "لا يوجد وصف لهذا المنتج."}</div>
        {/* أزرار */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-yellow-400 text-white font-bold py-3 rounded-lg transition-colors text-lg flex items-center justify-center gap-2 shadow"
          >
            <ShoppingCart className="w-6 h-6" />
            أضف إلى السلة
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 rounded-lg transition-colors text-lg flex items-center justify-center gap-2 shadow ${isInFavorites(product._id) ? 'bg-yellow-100' : ''}`}
            disabled={favLoading}
          >
            <Heart className="w-6 h-6" />
            {isInFavorites(product._id) ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
          </button>
        </div>
        {/* مراجعات العملاء */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            مراجعات العملاء
          </h2>
          <form onSubmit={handleAddReview} className="mb-6 flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="اسمك"
              className="border rounded px-3 py-2 w-full md:w-1/4"
              value={newReview.name}
              onChange={e => setNewReview({ ...newReview, name: e.target.value })}
              required
            />
            <select
              className="border rounded px-3 py-2 w-full md:w-1/6"
              value={newReview.rating}
              onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            >
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} نجوم</option>)}
            </select>
            <input
              type="text"
              placeholder="تعليقك"
              className="border rounded px-3 py-2 w-full md:w-2/4"
              value={newReview.comment}
              onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
              required
            />
            <button type="submit" className="bg-primary text-white rounded px-4 py-2">إضافة تقييم</button>
          </form>
          <div className="space-y-4">
            {reviews.length === 0 && <div className="text-gray-400">لا توجد مراجعات بعد.</div>}
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center gap-2">
                <div className="flex items-center gap-2 mb-2 md:mb-0">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-600">{rev.rating} نجوم</span>
                </div>
                <div className="flex-1">
                  <span className="font-bold text-primary">{rev.name}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span>{rev.comment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 