import { Trash2, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { useCart } from "@/context/CartContext";
import { getFavorites, deleteFavorite } from "@/lib/api";

interface FavoriteBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favoritesProp?: any[];
}

const FavoriteBox: React.FC<FavoriteBoxProps> = ({ open, onOpenChange, favoritesProp }) => {
  const [favorites, setFavorites] = useState<any[]>(favoritesProp || []);
  const [loading, setLoading] = useState(!favoritesProp);
  const { addToCart, openCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (open && !favoritesProp && isLoggedIn) {
      setLoading(true);
      getFavorites()
        .then((data) => {
          setFavorites(Array.isArray(data) ? data : data.data || []);
          setLoading(false);
        })
        .catch(() => {
          setFavorites([]);
          setLoading(false);
        });
    } else if (favoritesProp) {
      setFavorites(favoritesProp);
      setLoading(false);
    } else if (!isLoggedIn) {
      setFavorites([]);
      setLoading(false);
    }
  }, [open, favoritesProp, isLoggedIn]);

  const handleDelete = async (id: string) => {
    await deleteFavorite(id);
    setFavorites((prev) => prev.filter((item) => item._id !== id));
    
    // إرسال حدث لتحديث العداد في الهيدر
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg pt-16">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>المفضلة</SheetTitle>
            <Heart className="text-yellow-400 w-6 h-6" />
          </div>
        </SheetHeader>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg">جاري تحميل المفضلة...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg">المفضلة فارغة.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="flex flex-col gap-6">
              {favorites.map((item) => (
                <div key={item._id} className="flex w-full items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={item.image?.[0]?.url || "/icons/products/1.png"}
                        alt={item.title?.ar || item.title?.en || "منتج"}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold break-words">
                        {item.title?.ar || item.title?.en || "اسم المنتج"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.price} د.ك
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          // تحقق من وجود id المنتج
                          const itemId = item._id || item.id;
                          if (!itemId) {
                            console.error('🚫 لا يمكن إضافة منتج بدون id:', item);
                            return;
                          }
                          
                          addToCart({
                            _id: itemId,
                            name: item.title?.ar || item.title?.en || "اسم المنتج",
                            price: item.sale && item.sale > 0
                              ? Number((item.price - (item.price * item.sale / 100)).toFixed(2))
                              : item.price || 0,
                            image: item.image?.[0]?.url || "/icons/products/1.png",
                          });
                          openCart();
                        }}
                      >
                        أضف للسلة
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-red-500"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoriteBox; 