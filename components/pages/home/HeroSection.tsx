"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { getHeroBanner } from "@/lib/api";

const HeroSection = () => {
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHeroBanner()
      .then((data) => {
        // البيانات تأتي ككائن واحد وليس كمصفوفة
        if (data && typeof data === 'object' && data.image) {
          setBanner(data);
        } else if (Array.isArray(data) && data.length > 0) {
          setBanner(data[0]);
        } else {
          // استخدام البيانات الافتراضية
          setBanner({
            image: { url: "/icons/home/1.png" },
            url: "#"
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        // في حالة الخطأ، استخدم البيانات الافتراضية
        setBanner({
          image: { url: "/icons/home/1.png" },
          url: "#"
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[40vw] min-h-[180px] max-h-[320px] sm:h-[50vw] md:h-[50vh] flex items-center justify-center bg-gray-100">
        <span className="text-lg text-gray-400">جاري تحميل الإعلان...</span>
      </div>
    );
  }

  if (!banner || !banner.image) {
    return (
      <div className="w-full h-[40vw] min-h-[180px] max-h-[320px] sm:h-[50vw] md:h-[50vh] flex items-center justify-center bg-gray-100">
        <span className="text-lg text-gray-400">لا يوجد بنر إعلاني متاح</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[40vw] min-h-[180px] max-h-[320px] sm:h-[50vw] md:h-[50vh] flex items-center justify-center overflow-hidden mt-4">
      <Image
        className="h-full w-full object-cover z-[1]"
        src={banner.image.url}
        width={1300}
        height={400}
        alt="بنر إعلاني"
        priority
      />
      {banner.url && (
        <div className="absolute z-10 left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-end bg-black/10 pb-12 pr-72">
          <div className="w-full flex justify-start md:justify-center">
            <a
              href={banner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-xs py-1 px-5 rounded shadow transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300 drop-shadow border-2 border-yellow-300 hover:scale-105 mr-8 md:text-2xl md:py-4 md:px-12 md:rounded-full md:mr-0 md:font-extrabold md:shadow-2xl"
              style={{ boxShadow: '0 3px 12px 0 rgba(0,0,0,0.12)' }}
            >
              اشترِ الآن
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;