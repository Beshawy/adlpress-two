"use client";
import HeroSection from '@/components/pages/home/HeroSection';
import ProductSection from '@/components/pages/home/ProductsSection';
import CategoriesSection from '@/components/pages/home/categoriesSection';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAllProducts, addFavorite, deleteFavorite, getFavorites } from '@/lib/api';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductDetails from '@/components/pages/home/ProductDetails';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState<string | null>(null);
  const { addToCart, openCart } = useCart();
  const isLoggedIn = !!(typeof window !== 'undefined' && localStorage.getItem('token'));

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || 'فشل جلب المنتجات'))
      .finally(() => setLoading(false));
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

  const handleToggleFavorite = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }
    
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

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
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
  };

  // توزيع المنتجات بشكل ثابت (بدون عشوائية)
  // قسم المنتجات المميزة - أول 6 منتجات
  const featured = products.slice(0, 6);
  // قسم المنتجات الجديدة - المنتجات من 6 إلى 12
  const newest = products.slice(6, 12);
  // قسم الأعلى مبيعاً - المنتجات من 12 إلى 18، أو إذا لم تكن كافية، استخدم المنتجات من 0 إلى 6
  const bestSeller = products.slice(12, 18);

  // توزيع ذكي للمنتجات لضمان وجود منتجات في كل قسم
  let finalNewest = newest;
  let finalBestSeller = bestSeller;

  // إذا لم يوجد منتجات كافية في قسم المنتجات الجديدة
  if (newest.length === 0 && products.length > 0) {
    // استخدم المنتجات من 6 إلى 12، أو إذا لم تكن كافية، استخدم المنتجات من 0 إلى 6
    if (products.length > 6) {
      finalNewest = products.slice(6, Math.min(12, products.length));
    } else {
      finalNewest = products.slice(0, Math.min(6, products.length));
    }
  }

  // إذا لم يوجد منتجات كافية في قسم الأعلى مبيعاً
  if (bestSeller.length === 0 && products.length > 0) {
    // استخدم المنتجات من 12 إلى 18، أو إذا لم تكن كافية، استخدم المنتجات من 6 إلى 12
    if (products.length > 12) {
      finalBestSeller = products.slice(12, Math.min(18, products.length));
    } else if (products.length > 6) {
      finalBestSeller = products.slice(6, Math.min(12, products.length));
    } else {
      finalBestSeller = products.slice(0, Math.min(6, products.length));
    }
  }

  // إذا كان عدد المنتجات محدود، وزعها بشكل متساوٍ
  if (products.length <= 6) {
    // إذا كان هناك 6 منتجات أو أقل، وزعها بالتساوي
    const half = Math.ceil(products.length / 2);
    finalNewest = products.slice(0, half);
    finalBestSeller = products.slice(half, products.length);
  }

  // تجنب تكرار المنتجات في الأقسام المختلفة
  const usedProductIds = new Set();
  featured.forEach(product => usedProductIds.add(product._id));
  
  // إذا كان هناك تكرار في المنتجات الجديدة، استخدم منتجات مختلفة
  if (finalNewest.some(product => usedProductIds.has(product._id))) {
    const availableProducts = products.filter(product => !usedProductIds.has(product._id));
    finalNewest = availableProducts.slice(0, Math.min(6, availableProducts.length));
    finalNewest.forEach(product => usedProductIds.add(product._id));
  }

  // إذا كان هناك تكرار في الأعلى مبيعاً، استخدم منتجات مختلفة
  if (finalBestSeller.some(product => usedProductIds.has(product._id))) {
    const availableProducts = products.filter(product => !usedProductIds.has(product._id));
    finalBestSeller = availableProducts.slice(0, Math.min(6, availableProducts.length));
  }

  // إذا لم يوجد منتجات كافية في المنتجات الجديدة، استخدم منتجات من نهاية القائمة
  if (finalNewest.length === 0 && products.length > 0) {
    const remainingProducts = products.filter(product => !usedProductIds.has(product._id));
    if (remainingProducts.length > 0) {
      finalNewest = remainingProducts.slice(0, Math.min(6, remainingProducts.length));
    } else {
      // إذا لم توجد منتجات متبقية، استخدم المنتجات من نهاية القائمة
      finalNewest = products.slice(-Math.min(6, products.length));
    }
  }

  // إذا لم يوجد منتجات كافية في الأعلى مبيعاً، استخدم منتجات من نهاية القائمة
  if (finalBestSeller.length === 0 && products.length > 0) {
    const remainingProducts = products.filter(product => !usedProductIds.has(product._id));
    if (remainingProducts.length > 0) {
      finalBestSeller = remainingProducts.slice(0, Math.min(6, remainingProducts.length));
    } else {
      // إذا لم توجد منتجات متبقية، استخدم المنتجات من نهاية القائمة
      finalBestSeller = products.slice(-Math.min(6, products.length));
    }
  }

  // ضمان أن قسم الأعلى مبيعاً يحتوي على منتجات مختلفة
  if (finalBestSeller.length > 0 && finalBestSeller.some(product => 
    featured.some(f => f._id === product._id) || finalNewest.some(n => n._id === product._id)
  )) {
    const allUsedIds = new Set([
      ...featured.map(p => p._id),
      ...finalNewest.map(p => p._id)
    ]);
    const uniqueProducts = products.filter(product => !allUsedIds.has(product._id));
    if (uniqueProducts.length > 0) {
      finalBestSeller = uniqueProducts.slice(0, Math.min(6, uniqueProducts.length));
    }
  }

  // ضمان أن قسم المنتجات الجديدة يحتوي على منتجات مختلفة
  if (finalNewest.length > 0 && finalNewest.some(product => 
    featured.some(f => f._id === product._id)
  )) {
    const featuredIds = new Set(featured.map(p => p._id));
    const uniqueProducts = products.filter(product => !featuredIds.has(product._id));
    if (uniqueProducts.length > 0) {
      finalNewest = uniqueProducts.slice(0, Math.min(6, uniqueProducts.length));
    }
  }

  // رسالة تشخيصية (يمكن حذفها لاحقاً)
  console.log('📊 توزيع المنتجات:', {
    totalProducts: products.length,
    featured: featured.length,
    newest: finalNewest.length,
    bestSeller: finalBestSeller.length
  });

  return (
    <>
      <main>
        <HeroSection />
        <div>
          <CategoriesSection title="تسوق من أفضل الفئات" linkAll={`/categories`} isHome />
        </div>
        {/* قسم المنتجات المميزة */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">منتجات مميزة</h2>
            {loading ? (
              <div className="text-center py-10">جاري تحميل المنتجات...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : featured.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-xl text-gray-500">لا توجد منتجات مميزة متاحة حالياً</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featured.map((product, index) => (
                  <ProductCard 
                    key={`featured-${product._id || product.id || index}`} 
                    product={product} 
                    onClick={() => setSelectedProduct(product)}
                    onAddToCart={(e) => handleAddToCart(product, e)}
                    onToggleFavorite={(e) => handleToggleFavorite(product, e)}
                    isInFavorites={isInFavorites(product._id)}
                    favLoading={favLoading === product._id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        {/* قسم المنتجات الجديدة */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">منتجات جديدة</h2>
            {loading ? (
              <div className="text-center py-10">جاري تحميل المنتجات...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : finalNewest.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-xl text-gray-500">لا توجد منتجات جديدة متاحة حالياً</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {finalNewest.map((product, index) => (
                  <ProductCard 
                    key={`newest-${product._id || product.id || index}`} 
                    product={product} 
                    onClick={() => setSelectedProduct(product)}
                    onAddToCart={(e) => handleAddToCart(product, e)}
                    onToggleFavorite={(e) => handleToggleFavorite(product, e)}
                    isInFavorites={isInFavorites(product._id)}
                    favLoading={favLoading === product._id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        {/* قسم الأعلى مبيعًا */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">الأعلى مبيعًا</h2>
            {loading ? (
              <div className="text-center py-10">جاري تحميل المنتجات...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : finalBestSeller.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-xl text-gray-500">لا توجد منتجات في قائمة الأكثر مبيعاً حالياً</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {finalBestSeller.map((product, index) => (
                  <ProductCard 
                    key={`bestseller-${product._id || product.id || index}`} 
                    product={product} 
                    onClick={() => setSelectedProduct(product)}
                    onAddToCart={(e) => handleAddToCart(product, e)}
                    onToggleFavorite={(e) => handleToggleFavorite(product, e)}
                    isInFavorites={isInFavorites(product._id)}
                    favLoading={favLoading === product._id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      {/* نافذة تفاصيل المنتج */}
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}

function ProductCard({ 
  product, 
  onClick, 
  onAddToCart, 
  onToggleFavorite, 
  isInFavorites, 
  favLoading 
}: { 
  product: any, 
  onClick: () => void,
  onAddToCart: (e: React.MouseEvent) => void,
  onToggleFavorite: (e: React.MouseEvent) => void,
  isInFavorites: boolean,
  favLoading: boolean
}) {
  return (
    <div className="relative border rounded-lg shadow-md p-4 hover:shadow-lg hover:border-black transition-all duration-200 bg-white cursor-pointer" onClick={onClick}>
      {/* أيقونات السلة والمفضلة */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        {/* زر المفضلة */}
        <button
          onClick={onToggleFavorite}
          className={`rounded-full p-2 shadow transition-colors duration-200 bg-primary text-white hover:bg-yellow-400 ${isInFavorites ? 'bg-yellow-400' : ''}`}
          title={isInFavorites ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
          disabled={favLoading}
        >
          <Heart className="w-4 h-4 transition-colors duration-200 fill-white" />
        </button>
        {/* زر السلة */}
        <button
          onClick={onAddToCart}
          className="rounded-full p-2 shadow bg-primary text-white hover:bg-secondary transition-colors"
          title="أضف إلى السلة"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
      
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
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
          {product?.title?.ar || product?.title?.en || "اسم المنتج"}
        </h3>
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
        {product?.sale && product.sale > 0 && (
          <div className="mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded inline-block">
            خصم {product.sale}%
          </div>
        )}
      </div>
    </div>
  );
} 