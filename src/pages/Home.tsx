import { motion, useScroll, useTransform } from 'motion/react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const Particles = () => {
  const items = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 15,
    scale: 0.5 + Math.random() * 1.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-70">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute rounded-full bg-[#fbf5c4] blur-[2px]"
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`, 
            width: 3 * item.scale, 
            height: 3 * item.scale,
            boxShadow: '0 0 12px rgba(244,227,142,0.8)'
          }}
          animate={{
            y: [-30, -150],
            x: [0, Math.random() * 30 - 15],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const RotatingMandala = ({ opacity = 0.15, size = 600, speed = 40, reverse = false, className = "" }: {opacity?: number, size?: number, speed?: number, reverse?: boolean, className?: string}) => (
  <motion.div
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    className={`absolute pointer-events-none flex items-center justify-center ${className}`}
    style={{ opacity, width: size, height: size }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <path d="M50 0L60 30L90 10L70 40L100 50L70 60L90 90L60 70L50 100L40 70L10 90L30 60L0 50L30 40L10 10L40 30L50 0Z" stroke="#d4af37" strokeWidth="0.5" fill="none"/>
      <path d="M50 10L55 35L80 20L65 45L90 50L65 55L80 80L55 65L50 90L45 65L20 80L35 55L10 50L35 45L20 20L45 35L50 10Z" stroke="#f4e38e" strokeWidth="0.3" fill="none"/>
      <circle cx="50" cy="50" r="25" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="10" stroke="#fbf5c4" strokeWidth="0.5" />
      <path d="M50 25L53 45L70 50L53 55L50 75L47 55L30 50L47 45L50 25Z" fill="#aa8529" opacity="0.4"/>
    </svg>
  </motion.div>
);

const Section = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <section className={`min-h-[100svh] w-full flex flex-col items-center justify-center p-6 md:p-12 text-center relative z-10 overflow-hidden ${className}`}>
      {children}
    </section>
  );
};

const AnimatedText = ({ text, className = "", delay = 0 }: { text: string | React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
    viewport={{ once: false, margin: "-10%" }}
    transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {text}
  </motion.div>
);

const GoldDivider = () => (
  <motion.div 
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
    className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-8 mx-auto gold-glow"
  />
);

export default function Home() {
  const containerRef = useRef(null);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("Келемін");
  const [guestCount, setGuestCount] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attendance) {
      alert('Өтінемін, барлық өрістерді толтырыңыз');
      return;
    }
    setIsSubmitting(true);
    try {
      const finalStatus = attendance === "Келемін" 
        ? `${attendance} (${guestCount} адам)` 
        : attendance;

      const { error } = await supabase
        .from('guests')
        .insert([
          { name: name, status: finalStatus, guest_count: attendance === "Келемін" ? parseInt(guestCount) : 0 }
        ]);

      if (!error) {
        alert('Жауабыңыз қабылданды!');
        setName("");
        setAttendance("Келемін");
        setGuestCount("1");
        setIsSuccess(true);
      } else {
        console.error("Supabase error:", error);
        alert("Қате шықты. Қайта көріңіз.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Қате шықты. Интернет қосылымын тексеріңіз.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div ref={containerRef} className="font-[Montserrat,sans-serif] antialiased text-white">
      <Particles />

      {/* Global Vignette for cinematic look */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] mix-blend-multiply" />

      {/* Section 1: Greeting */}
      <Section>
        <RotatingMandala size={800} opacity={0.2} speed={50} className="-top-20" />
        <RotatingMandala size={1200} opacity={0.05} speed={80} reverse className="top-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative z-10 p-12 md:p-20 rounded-full border border-[#b8962e]/30 bg-slate-900/60 backdrop-blur-md gold-glow"
        >
          <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20 blur-sm scale-105" />
          
          <AnimatedText 
            text="Асқа шақыру" 
            className="font-serif text-6xl md:text-8xl tracking-wider text-gold-gradient drop-shadow-2xl mb-4" 
          />
          <GoldDivider />
          <AnimatedText 
            text="Еске алу" 
            delay={0.4}
            className="font-sans text-xl md:text-2xl tracking-[0.4em] uppercase text-[#fbf5c4]/80 font-light" 
          />
        </motion.div>
      </Section>

      {/* Section 2: Memorial */}
      <Section>
        <RotatingMandala size={900} opacity={0.1} speed={60} className="-right-1/2 md:-right-1/4" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Animated Frame for Photo */}
          <div className="relative w-64 h-80 md:w-80 md:h-[420px] mb-12">
            <motion.div 
              animate={{ rotate: 180 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
              className="absolute -inset-4 border border-[#d4af37]/40 rounded-t-full rounded-b-3xl opacity-50"
            />
            <motion.div 
              animate={{ rotate: -180 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
              className="absolute -inset-2 border-2 border-[#b8962e]/30 rounded-t-full rounded-b-[40px] opacity-70 blur-[1px]"
            />
            
            <div className="absolute inset-0 rounded-t-full rounded-b-[32px] overflow-hidden border-[4px] border-[#d4af37] p-1 gold-glow bg-slate-950">
              <img 
                src="/photo.png" 
                alt="Тлекеев Жұмағали Толеуғазыұлы" 
                className="w-full h-full object-cover rounded-t-full rounded-b-[24px] contrast-125 brightness-90 saturate-50"
              />
            </div>
          </div>
          
          <AnimatedText 
            text={<>Тлекеев Жұмағали<br/>Толеуғазыұлы</>}
            className="font-serif text-5xl md:text-7xl leading-tight text-gold-gradient mb-6" 
          />
          <AnimatedText 
            text="(21.12.1956 - 13.09.2006)"
            delay={0.3}
            className="font-sans text-2xl md:text-3xl text-[#f4e38e]/80 tracking-[0.2em] font-light" 
          />
        </motion.div>
      </Section>

      {/* Section 3: Poem */}
      <Section className="bg-slate-900/40">
        <RotatingMandala size={700} opacity={0.08} speed={45} reverse />
        
        <div className="relative z-10 max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[#85631c]/5 blur-3xl rounded-full"
          />
          <AnimatedText 
            text="«Жатқан жерің жәйлы болып, рухың биік болсын! Асыл бейнең жүрегімізде мәңгі сақталады.»"
            className="font-serif text-3xl md:text-5xl leading-relaxed italic text-gold-gradient text-center" 
          />
          <GoldDivider />
        </div>
      </Section>

      {/* Section 4: Addressees & Invitation */}
      <Section>
        <RotatingMandala size={1000} opacity={0.12} speed={70} className="-left-1/4" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <AnimatedText 
            text="Құрметті"
            className="font-serif text-4xl md:text-5xl text-[#d4af37] mb-8 tracking-widest uppercase" 
          />
          <AnimatedText 
            text="Ағайын-туыс, бауырлар, құда-жекжат, дос-жаран, көршілер және барша әкеміздің көзін көрген жамағат!"
            delay={0.2}
            className="font-sans text-xl md:text-3xl leading-loose text-[#fbf5c4]/90 font-light mb-16 px-4" 
          />
          
          <div className="w-24 h-[1px] bg-[#85631c] mb-16" />
          
          <AnimatedText 
            text="Сіздерді аяулы әкеміз"
            delay={0.4}
            className="font-serif text-3xl md:text-4xl text-[#f4e38e]/80 italic mb-6" 
          />
          <AnimatedText 
            text="Тлекеев Жұмағали Толеуғазыұлының"
            delay={0.6}
            className="font-serif text-4xl md:text-6xl text-gold-gradient mb-6" 
          />
          <AnimatedText 
            text="жылдық асына шақырамыз."
            delay={0.8}
            className="font-serif text-3xl md:text-5xl text-[#d4af37]" 
          />
        </div>
      </Section>

      {/* Section 5: Details */}
      <Section>
        <RotatingMandala size={800} opacity={0.1} speed={55} reverse />
        
        <div className="w-full max-w-2xl mx-auto space-y-8 relative z-10">
          {[
            { icon: Calendar, title: "Өтетін күні", desc: "06.06.2026 жылы" },
            { icon: Clock, title: "Уақыты", desc: "Сағат 12:00-де" },
            { icon: MapPin, title: "Мекен-жайы", desc: "Кұлжа тракты 1а, Гулдала ауылы, «Береке» рестораны" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 1.2, delay: index * 0.3, ease: "easeOut" }}
              className="relative p-[1px] rounded-3xl bg-gradient-to-r from-[#85631c]/30 via-[#d4af37]/80 to-[#85631c]/30 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[#d4af37]/20 mix-blend-overlay group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center p-8 bg-slate-950/95 backdrop-blur-xl rounded-[23px] relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#aa8529]/40 flex items-center justify-center mr-8 flex-shrink-0 bg-slate-800 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)] relative overflow-hidden group-hover:border-[#d4af37] transition-colors duration-500">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-20 bg-[conic-gradient(from_0deg,transparent,rgba(212,175,55,0.8),transparent)]"
                  />
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 text-[#d4af37] relative z-10 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm md:text-lg text-[#aa8529] uppercase tracking-[0.2em] mb-2 font-medium">{item.title}</p>
                  <p className="font-serif text-2xl md:text-4xl text-[#fbf5c4] leading-tight drop-shadow-lg">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Section 6: Hosts */}
      <Section className="pb-16">
        <RotatingMandala size={1200} opacity={0.15} speed={60} className="bottom-0" />
        
        <div className="relative z-10 flex flex-col items-center">
          <GoldDivider />
          <AnimatedText 
            text="Ас берушілер:"
            className="font-serif text-4xl md:text-5xl text-[#d4af37] mb-6" 
          />
          <AnimatedText 
            text="Марқұмның балалары"
            delay={0.3}
            className="font-sans text-2xl md:text-4xl text-gold-gradient uppercase tracking-[0.3em] font-light" 
          />
          <div className="mt-16">
            <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L55 15L70 15L58 25L62 40L50 30L38 40L42 25L30 15L45 15L50 0Z" fill="#d4af37" opacity="0.8"/>
              <path d="M50 10L52 18L60 18L54 23L56 30L50 25L44 30L46 23L40 18L48 18L50 10Z" fill="#fbf5c4" opacity="0.9"/>
            </svg>
          </div>
        </div>
      </Section>

      {/* Section 7: RSVP Form */}
      <Section className="pb-32 bg-slate-900/40">
        <RotatingMandala size={800} opacity={0.08} speed={55} reverse />
        
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
          <AnimatedText 
            text="Асқа келуіңізді растауыңызды сұраймыз"
            className="font-serif text-3xl md:text-5xl text-[#d4af37] mb-8 text-center px-4" 
          />
          
          <div className="w-full bg-slate-950/80 backdrop-blur-md rounded-3xl p-8 border border-[#d4af37]/30 gold-glow">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-[#d4af37]/20 text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/50">
                  <span className="text-3xl">✓</span>
                </div>
                <h4 className="font-serif text-3xl text-gold-gradient mb-4 italic">Көп рахмет!</h4>
                <p className="text-[#fbf5c4] text-lg font-light leading-relaxed">
                  Сіздің жауабыңыз қабылданды.<br/>Күтеміз!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Есіміңіз" 
                    className="w-full bg-slate-900/80 border border-[#b8962e]/50 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all placeholder:text-gray-500 text-white"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-3">
                  {[
                    "Келемін",
                    "Келе алмаймын"
                  ].map((option) => (
                    <label key={option} className={`flex items-center gap-3 p-4 rounded-xl border border-[#b8962e]/50 bg-slate-900/80 cursor-pointer hover:border-[#d4af37] transition-colors ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${attendance === option ? 'border-[#d4af37]' : 'border-gray-500'}`}>
                        {attendance === option && <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div>}
                      </div>
                      <input 
                        type="radio" 
                        name="attendance" 
                        value={option}
                        checked={attendance === option}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <span className="text-lg text-[#fbf5c4]">{option}</span>
                    </label>
                  ))}
                </div>

                {attendance === "Келемін" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden pt-2"
                  >
                    <label className="block text-sm text-[#f4e38e] mb-2 ml-1 font-medium tracking-wider uppercase">Қанша адам келесіздер?</label>
                    <input 
                      type="number" 
                      min="1"
                      max="10"
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="Адам саны" 
                      className="w-full bg-slate-900/80 border border-[#b8962e]/50 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all text-white"
                      disabled={isSubmitting}
                    />
                  </motion.div>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#85631c] via-[#d4af37] to-[#85631c] hover:opacity-90 text-slate-950 py-4 rounded-xl font-bold text-lg tracking-widest uppercase transition-opacity shadow-lg shadow-[#d4af37]/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                      Күте тұрыңыз...
                    </>
                  ) : (
                    "Жауап беру"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
