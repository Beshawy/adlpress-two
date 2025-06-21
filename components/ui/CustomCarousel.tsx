"use client"
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"


function CustomCarousel({
children
}:{
    children: React.ReactNode
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index)
    }
  }

  return (
    <div className="p-0 relative -mt-5">
      <Carousel
        setApi={setApi}
        className="w-full p-0 bg-primary"
        opts={{ loop: true, direction: "ltr" }}
      >
        <CarouselContent className="flex relative !p-0 !m-0 w-full" >
            {children}
        </CarouselContent>  
        <CarouselPrevious className="!start-4"/>
        <CarouselNext className="!end-4"/>
      </Carousel>
        <div className="text-center text-sm text-muted-foreground absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex justify-center gap-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <span
                key={index}
                className={`size-2 rounded-full cursor-pointer bg-white ${
                  current - 1 === index ? "px-3 !bg-secondary" : ""
                }`}
                onClick={() => handleDotClick(index)}
              >
              </span>
            ))}
          </div>
        </div>
    </div>
  )
}


export default CustomCarousel