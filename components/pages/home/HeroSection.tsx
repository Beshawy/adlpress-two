"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Carousel = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000 }}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      pagination={{
        el: ".swiper-pagination",
        clickable: true,
        // bulletClass: "!bg-white !flex",
        // currentClass: "!bg-white !flex",
        bulletActiveClass: "active"
      }}
      className="relative"
    >
      {[...Array(4)].map((_, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-64 md:h-[50vh]">
            <Image
              className="h-full w-screen relative z-[1] object-cover"
              src="/icons/auth/hero/hero.png"
              width={1300}
              height={1300}
              alt=""
            />
          </div>
        </SwiperSlide>
      ))}
      {/* Navigation Buttons */}
      <div className="swiper-button-prev text-white" aria-label="السابق"></div>
      <div className="swiper-button-next text-white" aria-label="التالي"></div>
      {/* Pagination Dots */}
      <div className="swiper-pagination mb-4 [&>*]:!bg-white [&>.active]:!bg-secondary [&>*]:!opacity-100 [&>.active]:!px-2 [&>.active]:!rounded-md"></div>
    </Swiper>
  );
};

export default Carousel;