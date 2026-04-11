import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star } from 'lucide-react';

import swperimge1 from '../assets/1st swperimage.jpeg';
import swperimge2 from '../assets/2swiperimge.jpeg';
import swperimge3 from '../assets/3rd swiperimge.jpeg';

const testimonialSlides = [
  {
    image: swperimge1,
    quote: "A Star Classes helped me achieve A* in Physics and Chemistry. The teaching quality is exceptional!",
    name: "Sarah M.",
  },
  {
    image: swperimge2,
    quote: "The personalized attention and doubt clearing sessions made all the difference in my grades.",
    name: "Arjun K.",
  },
  {
    image: swperimge3,
    quote: "Excellent teaching methodology and comprehensive study materials. Highly recommended!",
    name: "Emma L.",
  }
];

export const Slider = () => (
  <Swiper
    modules={[Pagination, Autoplay]}
    pagination={{ clickable: true }}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    spaceBetween={24}
    slidesPerView={1}
    className="rounded-2xl h-full"
  >
    {testimonialSlides.map((slide, idx) => (
      <SwiperSlide key={idx}>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 h-full flex flex-col">
          <div className="relative flex-1 min-h-[350px] bg-slate-800/50">
            <img
              src={slide.image}
              alt={slide.name}
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
          </div>
          <div className="p-6 bg-slate-900/90 backdrop-blur-md border-t border-white/10">
            <div className="flex justify-center space-x-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-white/90 font-medium italic leading-relaxed text-center">"{slide.quote}"</p>
            <p className="text-[10px] text-white/40 mt-3 font-black uppercase tracking-[0.2em] text-center">{slide.name}</p>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);