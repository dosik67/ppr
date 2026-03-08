import { motion } from "motion/react";
import { MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const FloatingElement = ({ children, delay = 0, duration = 4, yOffset = 15, className = "" }: { children: React.ReactNode, delay?: number, duration?: number, yOffset?: number, className?: string }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -yOffset, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

const ButterflySVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.5C12 21.5 10.5 17 6.5 14.5C2.5 12 1.5 7.5 4.5 4.5C7.5 1.5 10.5 3.5 12 6.5C13.5 3.5 16.5 1.5 19.5 4.5C22.5 7.5 21.5 12 17.5 14.5C13.5 17 12 21.5 12 21.5Z" fill="currentColor" opacity="0.4"/>
    <path d="M12 21.5C12 21.5 11.5 17 8.5 14.5C5.5 12 4.5 7.5 6.5 5.5C8.5 3.5 10.5 5.5 12 7.5C13.5 5.5 15.5 3.5 17.5 5.5C19.5 7.5 18.5 12 15.5 14.5C12.5 17 12 21.5 12 21.5Z" fill="currentColor" opacity="0.6"/>
    <path d="M12 7.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 7.5C12 7.5 10.5 4.5 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 7.5C12 7.5 13.5 4.5 14.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Divider = () => (
  <div className="flex items-center justify-center py-8 opacity-40">
    <div className="h-px w-16 bg-primary/40"></div>
    <Heart className="mx-4 text-primary/60" size={14} strokeWidth={1.5} />
    <div className="h-px w-16 bg-primary/40"></div>
  </div>
);

export default function Home() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("Тойға келемін");
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
      const finalStatus = attendance === "Тойға келемін" 
        ? `${attendance} (${guestCount} адам)` 
        : attendance;

      const { error } = await supabase
        .from('guests')
        .insert([
          { name: name, status: finalStatus, guest_count: attendance === "Тойға келемін" ? parseInt(guestCount) : 0 }
        ]);

      if (!error) {
        alert('Жауабыңыз қабылданды!');
        setName("");
        setAttendance("Тойға келемін");
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
    <div className="min-h-screen bg-white flex justify-center font-sans text-[#4a4a4a]">
      <div className="w-full max-w-[480px] bg-white shadow-2xl shadow-primary/5 min-h-screen relative overflow-hidden">
        
        {/* Hero Section */}
        <div className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden bg-white px-6 py-12">
          
          {/* Decorative Butterflies */}
          <FloatingElement className="absolute top-[10%] left-[5%] text-primary rotate-[-15deg]" delay={0} duration={5}>
            <ButterflySVG className="w-16 h-16 opacity-60" />
          </FloatingElement>
          <FloatingElement className="absolute top-[20%] right-[10%] text-primary rotate-[20deg]" delay={1} duration={6} yOffset={20}>
            <ButterflySVG className="w-20 h-20 opacity-50" />
          </FloatingElement>
          <FloatingElement className="absolute bottom-[25%] left-[10%] text-primary rotate-[-25deg]" delay={2} duration={7} yOffset={25}>
            <ButterflySVG className="w-24 h-24 opacity-40" />
          </FloatingElement>
          <FloatingElement className="absolute bottom-[15%] right-[5%] text-primary rotate-[15deg]" delay={0.5} duration={4.5}>
            <ButterflySVG className="w-16 h-16 opacity-60" />
          </FloatingElement>
          <FloatingElement className="absolute top-[40%] left-[-5%] text-primary rotate-[45deg]" delay={1.5} duration={5.5}>
            <ButterflySVG className="w-20 h-20 opacity-30" />
          </FloatingElement>
          <FloatingElement className="absolute top-[60%] right-[-5%] text-primary rotate-[-45deg]" delay={2.5} duration={6.5}>
            <ButterflySVG className="w-20 h-20 opacity-30" />
          </FloatingElement>

          {/* Arch Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[340px] h-[80%] max-h-[600px] border border-[#d1c8c1] rounded-t-[200px] bg-secondary flex flex-col items-center justify-center p-8 shadow-sm"
          >
            <div className="absolute top-8 text-primary opacity-80">
              <ButterflySVG className="w-8 h-8" />
            </div>
            
            <div className="text-center mt-8 w-full">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="font-serif italic text-6xl md:text-7xl text-primary mb-6 leading-tight pr-2"
                style={{ textShadow: "2px 2px 0px rgba(139, 163, 199, 0.4), 4px 4px 10px rgba(43, 76, 126, 0.2)" }}
              >
                Ақжібек
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-col items-center justify-center mt-6 space-y-4"
              >
                <h2 className="font-display text-lg md:text-xl text-primary tracking-[0.3em] uppercase text-center">
                  1 ЖАС
                </h2>
                <h2 className="font-display text-sm md:text-base text-primary tracking-[0.3em] uppercase text-center">
                  ТҰСАУ КЕСЕР
                </h2>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="px-6 py-12 relative z-10 bg-white">
          
          {/* Invitation Text */}
          <FadeIn>
            <div className="text-center my-8 px-2">
              <h2 className="font-serif text-xl md:text-2xl text-primary mb-6 leading-relaxed">
                Құрметті ағайын-туыс, бауырлар, нағашы-жиен, бөлелер, құда-жекжат, дос-жарандар!
              </h2>
              <p className="text-sm leading-loose text-[#6b6b6b] font-light">
                Сіздерді сүйікті қызымыз <span className="font-medium text-primary font-serif text-lg">Ақжібектің</span> тұсаукесер тойына арнайы жайылған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!
              </p>
            </div>
          </FadeIn>

          <Divider />

          {/* Calendar */}
          <FadeIn>
            <div className="my-10">
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-primary">Наурыз 2026</h3>
              </div>
              
              <div className="bg-white rounded-[32px] p-8 border border-[#d1c8c1]/40 shadow-xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-secondary/80"></div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-accent mb-8 uppercase tracking-widest">
                  <div>Дс</div>
                  <div>Сс</div>
                  <div>Ср</div>
                  <div>Бс</div>
                  <div>Жм</div>
                  <div>Сн</div>
                  <div>Жк</div>
                </div>
                <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center font-serif text-lg text-primary">
                  {/* Empty days for March 2026 (Starts on Sunday) */}
                  {Array.from({ length: 6 }).map((_, i) => <div key={`empty-${i}`}></div>)}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isTarget = day === 29;
                    return (
                      <div key={day} className="flex justify-center items-center">
                        {isTarget ? (
                          <div className="relative w-9 h-9">
                            <div className="absolute top-1 left-1 w-full h-full border border-primary/50 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                              {day}
                            </div>
                          </div>
                        ) : (
                          <span className="w-9 h-9 flex items-center justify-center">
                            {day}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeIn>

          <Divider />

          {/* Time and Place */}
          <FadeIn>
            <div className="text-center my-10">
              <h3 className="font-serif text-3xl text-primary mb-6">29 / 03 / 2026 Ж.</h3>
              <div className="space-y-4 text-sm text-[#6b6b6b] font-light">
                <p><span className="font-medium text-primary">17:00</span> - Қонақтардың жиналуы</p>
                <p><span className="font-medium text-primary">18:00</span> - Тойдың басталуы</p>
              </div>
            </div>
          </FadeIn>

          <Divider />

          {/* Location & Map */}
          <FadeIn>
            <div className="text-center my-10">
              <h3 className="font-serif text-2xl text-primary mb-4">Мекен-жайымыз:</h3>
              <p className="text-lg text-[#6b6b6b] mb-8 font-serif">Егемендік 8193</p>
              
              <a 
                href="https://2gis.kz/almaty/geo/70000001088189529" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full transition-colors duration-300 shadow-md shadow-primary/20"
              >
                <MapPin size={18} />
                <span className="font-medium text-sm tracking-wide uppercase">Картадан көру</span>
              </a>
            </div>
          </FadeIn>

          <Divider />

          {/* Hosts */}
          <FadeIn>
            <div className="text-center my-10">
              <p className="text-xs text-primary/60 uppercase tracking-[0.2em] mb-4">Той иелері</p>
              <h3 
                className="font-serif italic text-3xl md:text-4xl text-primary"
                style={{ textShadow: "1px 1px 0px rgba(139, 163, 199, 0.3), 2px 2px 5px rgba(43, 76, 126, 0.15)" }}
              >
                Дінмұхаммед – Әйгерім
              </h3>
            </div>
          </FadeIn>

          <Divider />

          {/* RSVP Form */}
          <FadeIn>
            <div className="my-10 bg-secondary/30 rounded-3xl p-8 border border-[#d1c8c1]/50 shadow-sm min-h-[350px] flex flex-col justify-center">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={36} fill="currentColor" className="text-primary" />
                  </div>
                  <h4 className="font-serif text-3xl text-primary mb-4 italic">Көп рахмет!</h4>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">
                    Сіздің жауабыңыз қабылданды.<br/>Тойда күтеміз!
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-serif text-xl text-center text-primary mb-8 leading-relaxed">
                    Құрметті қонақтар! Тойға келетіндеріңізді растауларыңызды сұраймыз!
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Есіміңіз" 
                        className="w-full bg-white border border-[#d1c8c1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-[#a3a3a3] text-primary"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        "Тойға келемін",
                        "Келе алмаймын"
                      ].map((option) => (
                        <label key={option} className={`flex items-center gap-3 p-3 rounded-xl border border-[#d1c8c1] bg-white cursor-pointer hover:border-primary transition-colors ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${attendance === option ? 'border-primary' : 'border-primary/50'}`}>
                            {attendance === option && <div className="w-3 h-3 rounded-full bg-primary"></div>}
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
                          <span className="text-sm text-[#4a4a4a]">{option}</span>
                        </label>
                      ))}
                    </div>

                    {attendance === "Тойға келемін" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden pt-2"
                      >
                        <label className="block text-sm text-primary/80 mb-2 ml-1 font-medium">Қанша адам келесіздер?</label>
                        <input 
                          type="number" 
                          min="1"
                          max="10"
                          required
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          placeholder="Адам саны" 
                          className="w-full bg-white border border-[#d1c8c1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-primary"
                          disabled={isSubmitting}
                        />
                      </motion.div>
                    )}
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-medium text-sm tracking-wide uppercase transition-colors shadow-md shadow-primary/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Күте тұрыңыз...
                        </>
                      ) : (
                        "Жауап беру"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </FadeIn>
          
          {/* Footer */}
          <div className="text-center mt-16 mb-8 opacity-60">
            <p 
              className="text-3xl font-serif italic text-primary"
              style={{ textShadow: "1px 1px 0px rgba(139, 163, 199, 0.3)" }}
            >
              Ақжібек
            </p>
            <p className="text-xs font-sans tracking-widest text-primary mt-2 uppercase">2026</p>
          </div>

        </div>
      </div>
    </div>
  );
}
