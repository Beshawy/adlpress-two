"use client";
import React, { useEffect, useState } from "react";
import { getAllProducts, addFavorite, deleteFavorite, getFavorites } from "@/lib/api";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { AuthDialogs } from "@/components/auth/auth-dialogs";
import ProductDetails from './ProductDetails';

const ProductsSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const { addToCart, openCart } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  console.log("🟡 دخل المكون ProductsSection");

  useEffect(() => {
    console.log("🔥 بدء جلب المنتجات في ProductsSection...");
    getAllProducts()
      .then((data) => {
        console.log("✅ تم جلب المنتجات:", data);
        console.log("📊 نوع البيانات:", typeof data);
        console.log("📋 هل هي مصفوفة؟", Array.isArray(data));
        console.log("🔢 عدد المنتجات:", Array.isArray(data) ? data.length : 0);
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.warn("⚠️ البيانات ليست مصفوفة، تم تعيينها كمصفوفة فارغة");
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("❌ خطأ في جلب المنتجات:", err);
        setError(err.message || "فشل جلب المنتجات");
      })
      .finally(() => {
        console.log("🏁 انتهاء جلب المنتجات");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getFavorites()
        .then((data) => {
          setFavorites(Array.isArray(data) ? data : data.data || []);
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  const isInFavorites = (productId: string) => favorites.some((fav) => fav._id === productId);

  const handleToggleFavorite = async (product: any) => {
    setFavLoading(product._id);
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
    setFavLoading(null);
  };

  console.log("🎨 حالة ProductsSection:", { loading, error, productsCount: products.length });

  if (loading) {
    return (
      <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-10">
            <div className="text-xl font-bold text-primary mb-4">جاري تحميل المنتجات...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-10">
            <div className="text-xl font-bold text-red-500 mb-2">خطأ في تحميل المنتجات</div>
            <div className="text-gray-600">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-start border-b border-b-gray-200 pb-2 mb-6">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-primary border-b-2 border-primary flex gap-x-2 pb-2">
            <span>المنتجات</span>
            <span className="text-secondary">المميزة</span>
          </h2>
          <div className="text-sm text-gray-500">
            عدد المنتجات: {products.length}
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">لا توجد منتجات متاحة حالياً</div>
            <div className="text-sm text-gray-400 mt-2">سيتم إضافة منتجات قريباً</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product, index) => (
              <div
                key={`product-${product._id || product.id || index}`}
                className="relative border rounded-lg shadow-md p-4 hover:shadow-lg hover:border-black transition-all duration-200 bg-white cursor-pointer"
                onClick={() => {
                  console.log("🖱️ تم الضغط على المنتج:", product._id, product.title?.ar);
                  console.log("🖱️ المنتج الكامل:", product);
                  setSelectedProduct(product);
                  console.log("🖱️ selectedProduct تم تعيينه:", product);
                }}
              >
                {/* أيقونات السلة والمفضلة تحت بعض */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10" onClick={e => e.stopPropagation()}>
                  {/* زر المفضلة */}
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLogin(true);
                        return;
                      }
                      handleToggleFavorite(product);
                    }}
                    className={`rounded-full p-2 shadow transition-colors duration-200 group bg-primary text-white hover:bg-yellow-400`}
                    title={isInFavorites(product._id) ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
                    disabled={favLoading === product._id}
                  >
                    <Heart className="w-5 h-5 transition-colors duration-200 fill-white" />
                  </button>
                  {/* زر السلة */}
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLogin(true);
                        return;
                      }
                      const productId = product._id || product.id;
                      if (!productId) {
                        console.error('🚫 لا يمكن إضافة منتج بدون id:', product);
                        return;
                      }
                      addToCart({
                        _id: productId,
                        name: product?.title?.ar || product?.title?.en || "اسم المنتج",
                        price: product?.sale && product.sale > 0
                          ? Number((product.price - (product.price * product.sale / 100)).toFixed(2))
                          : product?.price || 0,
                        image: (Array.isArray(product?.image) && product?.image[0]?.url) ? product.image[0].url : "/icons/products/1.png",
                      });
                      openCart();
                    }}
                    className="rounded-full p-2 shadow bg-primary text-white hover:bg-secondary transition-colors"
                    title="أضف إلى السلة"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                {/* صورة المنتج */}
                <div className="mb-4 rounded-xl p-4 size-32 md:size-40 bg-gray-100 flex justify-center items-center">
                  <img
                    src={product?.image?.[0]?.url || "/icons/products/1.png"}
                    alt={product?.title?.ar || product?.title?.en || "منتج"}
                    className="object-center object-contain size-24"
                    onError={(e) => {
                      e.currentTarget.src = "/icons/products/1.png";
                    }}
                  />
                </div>
                {/* معلومات المنتج */}
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product?.title?.ar || product?.title?.en || "اسم المنتج"}
                  </h3>
                  {/* السعر */}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {product?.sale && product.sale > 0
                        ? `${(product.price - (product.price * product.sale / 100)).toFixed(2)}`
                        : product?.price || "0"
                      } د.ك
                    </span>
                    {product?.sale && product.sale > 0 && (
                      <span className="text-xs text-red-500 line-through">
                        {product?.price} د.ك
                      </span>
                    )}
                  </div>
                  {/* علامة الخصم */}
                  {product?.sale && product.sale > 0 && (
                    <div className="mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded inline-block">
                      خصم {product.sale}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Dialog تسجيل الدخول */}
      {showLogin && <AuthDialogs open={showLogin} defaultOpen={true} onClose={() => setShowLogin(false)} />}
      {selectedProduct && (
        <>
          {console.log("🎯 ProductDetails سيتم عرضه للمنتج:", selectedProduct._id)}
          <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </>
      )}
    </section>
  );
};

export default ProductsSection;