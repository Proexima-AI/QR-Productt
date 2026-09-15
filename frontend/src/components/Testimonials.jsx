import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Local Business Owner",
      content: "Since we started using ReviewBoost, our Google reviews have skyrocketed. We used to get maybe one review a month, now we're getting 5-10 every week. Customers love how easy it is to scan the QR code at the counter.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Retail Store Owner",
      content: "The AI reply feature saves my staff hours of work. We can respond to every single review professionally and instantly. It has significantly improved our local search ranking and brought in a lot of new members.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Priya+Patel&background=4F46E5&color=fff"
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Verified Customer",
      content: "We placed the QR codes on our checkout desk and in the waiting area. The friction for customers to leave a review is completely gone. It's the best marketing investment we've made this year.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Amit+Kumar&background=E91E63&color=fff"
    },
    {
      id: 4,
      name: "Neha Desai",
      role: "Satisfied Client",
      content: "I was skeptical at first, but the results speak for themselves. The automated system is flawless, and the dashboard gives me a clear view of our reputation. Highly recommend to any local business owner.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Neha+Desai&background=10B981&color=fff"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match transition duration
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto slide
  useEffect(() => {
    const autoPlay = setInterval(nextSlide, 5000);
    return () => clearInterval(autoPlay);
  }, []);

  return (
    <section className="w-[100vw] ml-[calc(-50vw+50%)] py-24 bg-[#0B1A30] relative overflow-hidden text-white">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="w-[95%] max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-[2.75rem] font-serif font-extrabold text-white leading-tight mb-6 tracking-tight">
            Trusted by Local Businesses
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            See how we're helping businesses like yours grow their online reputation and win more customers.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto px-0 md:px-20">
          {/* Slider Container */}
          <div className="overflow-hidden rounded-[2rem] bg-[#112340] border border-white/10 shadow-2xl relative">
            
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full shrink-0 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 md:gap-12">
                  
                  {/* Left: Quote & Content */}
                  <div className="flex-1 relative">
                    <Quote className="absolute -top-6 -left-6 w-12 h-12 text-blue-500/20 rotate-180" />
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl font-serif text-slate-100 leading-relaxed mb-8 relative z-10">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-14 h-14 rounded-full border-2 border-blue-500/30"
                      />
                      <div>
                        <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                        <p className="text-blue-400 text-sm font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons (Moved outside the card) */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all backdrop-blur-sm z-20 group hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all backdrop-blur-sm z-20 group hidden md:flex"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-500 w-8' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
