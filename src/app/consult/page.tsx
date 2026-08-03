"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Leaf, PhoneCall, CalendarCheck, MessageCircle, Star, Clock, Filter, CheckCircle2, Send, X } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import NotificationBell from '@/components/NotificationBell';
import { useNotification } from '@/contexts/NotificationContext';
import { Sidebar } from "@/components/layout/Sidebar";

const experts = [
  {
    id: 1,
    name: "Dr. Ramesh Kumar",
    role: "Senior Agronomist",
    experience: "15+ Years",
    rating: 4.9,
    reviews: 124,
    specialties: ["Wheat & Paddy", "Soil Health", "Pest Control"],
    image: "/experts/dr-ramesh.png",
    price: "₹500 / session",
    availability: "Available Today"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Horticulture Specialist",
    experience: "8 Years",
    rating: 4.8,
    reviews: 89,
    specialties: ["Fruits", "Greenhouse", "Organic Farming"],
    image: "/experts/priya-sharma.png",
    price: "₹400 / session",
    availability: "Next Slot: Tomorrow"
  },
  {
    id: 3,
    name: "Amit Desai",
    role: "Agricultural Economist",
    experience: "12 Years",
    rating: 4.7,
    reviews: 210,
    specialties: ["Market Trends", "Crop Planning", "Gov Subsidies"],
    image: "/experts/amit-desai.png",
    price: "₹600 / session",
    availability: "Available Today"
  },
  {
    id: 4,
    name: "Dr. Arjun Sharma",
    role: "Pathology Expert",
    experience: "10 Years",
    rating: 4.9,
    reviews: 142,
    specialties: ["Crop Diseases", "Pest Control", "Soil Health"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnjKdJ8IkqolUVeciOyWRvxitlVO8EUAl9iAjcSHvTRO6NQOjbv9UYAMQ2fwaPMO11Fc1kI0TCuYm0lJ2sM6H8TPL0tb8lhBv-RvgDlj6_91DNaFBhbrvSWre7A8mFrtjcCqe9to6pANsoKF35B0aRHZAVoaiJ7mPZrMpOBcRzpRuyV_Xg0ifcwTS-zw8SD5PtlWkEcFm9ikiNqIoEqtAQvc2H_vyOIpDiUBslWvNqizx7TSOhvd8JYAq6Bsdp7VYXCWATwkUKjw",
    price: "₹650 / session",
    availability: "Available Today"
  }
];

const EXPERT_QA: Record<number, Record<string, string>> = {
  1: { // Dr. Ramesh Kumar (Senior Agronomist)
    "What fertilizers are best for wheat?": "For wheat, a balanced NPK fertilizer (like 120:60:40) works best. Apply nitrogen in split doses: half at sowing, and the rest during the tillering stage. Consider a soil test first!",
    "How do I control aphids?": "Aphids can be managed effectively using Neem oil spray (10,000 ppm) mixed with water. For severe infestations, you might need a safe systemic insecticide like Imidacloprid as a last resort.",
    "Can you help with soil testing?": "Absolutely! A soil test is the first step to healthy crops. You can collect samples from 5 different spots in a zigzag pattern and mail them to our partner labs."
  },
  2: { // Priya Sharma (Horticulture Specialist)
    "How to manage greenhouse humidity?": "To manage greenhouse humidity, ensure proper ventilation, especially early in the morning. Use drip irrigation instead of overhead sprinklers to keep foliage dry, preventing fungal diseases.",
    "Best organic pesticide for fruits?": "For fruit trees, organic Spinosad or Bacillus thuringiensis (Bt) works wonders against caterpillars. For general pests, horticultural oils and insecticidal soaps are highly effective.",
    "Tips for higher tomato yield?": "Prune the suckers regularly, ensure consistent watering to prevent blossom end rot, and use a fertilizer higher in Phosphorus and Potassium once fruiting begins."
  },
  3: { // Amit Desai (Agricultural Economist)
    "Are there any subsidies for solar pumps?": "Yes! The PM-KUSUM scheme offers up to a 60% subsidy for setting up standalone solar pumps. The remaining amount can often be financed through agricultural banks.",
    "When should I sell my cotton?": "Based on current market trends, cotton prices are expected to rise by 4-5% in the next two months due to export demands. If you can store it properly, I recommend holding for a bit longer.",
    "How to price organic produce?": "Organic produce usually commands a 20-30% premium. You should calculate your input costs, factor in certification fees, and research your local direct-to-consumer market prices."
  },
  4: { // Dr. Arjun Sharma (Pathology Expert)
    "What is Alternaria Leaf Spot?": "Alternaria Leaf Spot is a fungal disease that causes circular brown spots with concentric rings. It often affects plants with potassium deficiency or during warm, humid conditions.",
    "How to treat diseased crops?": "The best approach is to remove infected leaves immediately to prevent spread. Then apply a copper-based fungicide or an organic alternative like Neem oil every 7-10 days.",
    "Is my plant going to survive?": "It depends on the severity. If caught early, most plants recover within a couple of weeks after proper fungicide application and improved airflow."
  }
};

function ConsultContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const initialBookedId = searchParams?.get('booked');
  const [selectedExpert, setSelectedExpert] = useState<number | null>(initialBookedId ? parseInt(initialBookedId) : null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success'>(initialBookedId ? 'success' : 'idle');

  // Chat State
  const [activeChatExpert, setActiveChatExpert] = useState<typeof experts[0] | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'expert', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { addNotification } = useNotification();

  // Filter State
  const [filterSpecialty, setFilterSpecialty] = useState("All");
  const [filterAvailableToday, setFilterAvailableToday] = useState(false);

  // Booking Modal State
  const [bookingModalExpert, setBookingModalExpert] = useState<typeof experts[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  if (status === "loading") {
    return <PageLoader />;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  const openChat = (expert: typeof experts[0]) => {
    setActiveChatExpert(expert);
    setChatMessages([
      { role: 'expert', text: `Hi there! I'm ${expert.name}. How can I assist you with your farming needs today?` }
    ]);
  };

  const handleSendMessage = (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    
    const message = textOverride || chatInput.trim();
    if (!message || !activeChatExpert) return;

    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI Chatbot response with predefined answers
    setTimeout(() => {
      const expertQA = EXPERT_QA[activeChatExpert.id] || {};
      
      let response = expertQA[message];
      
      if (!response) {
        // Dynamic AI heuristic for unmapped questions
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.match(/\b(hi|hello|hey|greetings)\b/)) {
          response = `Hello! How can I help you with your ${activeChatExpert.specialties[0].toLowerCase()} today?`;
        } else if (lowerMsg.match(/\b(help|support|what can you do|who are you)\b/)) {
          response = `I am a ${activeChatExpert.role} with ${activeChatExpert.experience} of experience. I specialize in ${activeChatExpert.specialties.join(', ')}. What specific issue are you facing?`;
        } else if (lowerMsg.match(/\b(book|schedule|appointment|time)\b/)) {
          response = `I would love to discuss this on a video call. My next availability is ${activeChatExpert.availability}. You can use the 'Book Video' button to schedule a slot!`;
        } else if (lowerMsg.match(/\b(cost|price|fee|pay)\b/)) {
          response = `My consultation fee is ${activeChatExpert.price}. This covers a full video assessment and a follow-up report.`;
        } else if (lowerMsg.match(/\b(thank you|thanks|thx)\b/)) {
          response = "You're very welcome! Let me know if you need anything else.";
        } else if (lowerMsg.match(/\b(weather|rain|sun)\b/)) {
          response = "Weather plays a huge role in agriculture. If you're concerned about upcoming conditions, make sure to check the Weather module on the platform to plan your irrigation accordingly.";
        } else {
          // Extract a potential keyword to reflect back
          const words = message.split(' ').filter(w => w.length > 4);
          const keyword = words.length > 0 ? words[Math.floor(Math.random() * words.length)] : "that topic";
          
          response = `That's an interesting question regarding ${keyword}. As a ${activeChatExpert.role}, I encounter this often. To give you the best advice for your specific farm, I'd recommend booking a brief video call so we can look at it together in detail.`;
        }
      }
      
      setChatMessages(prev => [...prev, { role: 'expert', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const currentQA = activeChatExpert ? EXPERT_QA[activeChatExpert.id] || {} : {};
  const predefinedQuestions = Object.keys(currentQA);

  const filteredExperts = experts.filter(expert => {
    if (filterAvailableToday && expert.availability !== "Available Today") return false;
    if (filterSpecialty !== "All" && !expert.role.includes(filterSpecialty)) return false;
    return true;
  });

  const openBookingModal = (expert: typeof experts[0]) => {
    setBookingModalExpert(expert);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalExpert || !selectedDate || !selectedTime) return;

    setBookingStatus('booking');
    
    // Simulate booking API
    setTimeout(() => {
      setBookingStatus('success');
      setSelectedExpert(bookingModalExpert.id);
      
      addNotification({
        title: 'Video Consultation Booked',
        message: `Your appointment with ${bookingModalExpert.name} is confirmed for ${selectedDate} at ${selectedTime}.`,
        type: 'booking'
      });

      setBookingModalExpert(null); // Close modal
      setTimeout(() => {
        setBookingStatus('idle');
        setSelectedExpert(null);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-8 md:pb-0">
        {/* TopNavBar */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 shrink-0 z-30 flex items-center justify-between px-6 w-full max-w-container-max mx-auto shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="p-1 rounded-lg bg-primary text-on-primary">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">
                Smart Farming<span className="text-primary">.</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="h-6 w-px bg-outline-variant mx-1"></div>
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name || "Farmer"}</p>
              </div>
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image width={32} height={32} className="w-8 h-8 rounded-full border border-outline-variant object-cover" alt="Farmer Portrait" src={session.user.image} />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center text-[12px] font-bold tracking-wider">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage p-4 md:p-6 pb-24">
          <div className="max-w-container-max mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="bg-surface-glass border border-outline-variant/60 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <PhoneCall size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[12px] font-bold mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Experts Available Now
                </div>
                <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface mb-2">Consult an Agronomist</h2>
                <p className="text-on-surface-variant font-body-sm max-w-lg mb-6">
                  Book a 1-on-1 video consultation or direct chat with certified agriculture experts to solve pest issues, plan crops, or discuss soil health.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <div className="relative inline-block">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={16} />
                    <select 
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="pl-11 pr-8 py-2 bg-surface border border-outline-variant rounded-xl text-[13px] font-medium text-on-surface flex items-center gap-2 hover:bg-surface-container-high transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="All">All Specialties</option>
                      <option value="Agronomist">Agronomist</option>
                      <option value="Horticulture">Horticulture</option>
                      <option value="Economist">Economist</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => setFilterAvailableToday(!filterAvailableToday)}
                    className={`px-4 py-2 border rounded-xl text-[13px] font-medium flex items-center gap-2 transition-colors shadow-sm ${
                      filterAvailableToday 
                      ? 'bg-primary border-primary text-on-primary' 
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <Clock size={16} /> Available Today
                  </button>
                </div>
              </div>
            </div>

            {/* Experts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.length > 0 ? filteredExperts.map(expert => (
                <div key={expert.id} className="bg-surface-glass border border-outline-variant/60 rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-colors flex flex-col h-full">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-outline-variant/50">
                      <Image src={expert.image} alt={expert.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface text-[15px] leading-tight">{expert.name}</h3>
                      <p className="text-[12px] text-primary font-medium mt-1">{expert.role}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-on-surface-variant">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-on-surface">{expert.rating}</span>
                        <span>({expert.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {expert.specialties.map(spec => (
                        <span key={spec} className="px-2 py-1 bg-surface-container-lowest border border-outline-variant/40 rounded text-[11px] text-on-surface-variant font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-[12px] pt-2 border-t border-outline-variant/30 mt-3">
                      <span className="text-on-surface-variant flex items-center gap-1">
                        <Clock size={14} /> {expert.experience} exp
                      </span>
                      <span className="font-bold text-on-surface">{expert.price}</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-[11px] font-bold text-success flex items-center gap-1 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      {expert.availability}
                    </p>
                    
                    {bookingStatus === 'success' && selectedExpert === expert.id ? (
                      <div className="w-full py-2 bg-success-soft text-success text-center rounded-xl text-[13px] font-bold border border-success/30 flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> Booked! Check Email
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          disabled={bookingStatus === 'booking'}
                          onClick={() => openBookingModal(expert)}
                          className="w-full py-2 bg-primary text-on-primary rounded-xl text-[12px] font-bold hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {bookingStatus === 'booking' && selectedExpert === expert.id ? (
                            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                          ) : (
                            <>
                              <CalendarCheck size={14} /> Book Video
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => openChat(expert)}
                          className="w-full py-2 bg-surface text-on-surface border border-outline-variant rounded-xl text-[12px] font-bold hover:bg-surface-container-high transition-colors shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle size={14} /> Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-12 text-center text-on-surface-variant flex flex-col items-center">
                  <Filter size={48} className="opacity-20 mb-3" />
                  <p className="font-bold text-[15px]">No experts found</p>
                  <p className="text-[13px] mt-1">Try adjusting your filters to see more results.</p>
                  <button 
                    onClick={() => { setFilterAvailableToday(false); setFilterSpecialty("All"); }}
                    className="mt-4 px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg text-[13px] hover:bg-primary/20 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Chat Window */}
      {activeChatExpert && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[340px] h-[480px] max-h-[90vh] bg-surface-glass backdrop-blur-xl border border-outline-variant/60 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in">
          {/* Chat Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                <Image src={activeChatExpert.image} alt={activeChatExpert.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-on-primary text-[14px] leading-tight">{activeChatExpert.name}</h3>
                <p className="text-on-primary/80 text-[11px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveChatExpert(null)}
              className="p-1 rounded-lg text-on-primary hover:bg-black/10 transition-colors"
              title="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div data-lenis-prevent="true" className="flex-1 p-4 bg-background-sage overflow-y-auto flex flex-col gap-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary text-on-primary rounded-tr-sm' 
                    : 'bg-surface border border-outline-variant/50 text-on-surface rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-surface border border-outline-variant/50 text-on-surface rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="bg-surface border-t border-outline-variant/60 flex flex-col">
            {/* Quick Actions (Predefined Questions) */}
            <div className="px-3 pt-3 pb-2 flex gap-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
              {predefinedQuestions.map(q => (
                <button 
                  key={q}
                  onClick={() => handleSendMessage(undefined, q)}
                  disabled={isTyping}
                  className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded-full text-[11px] font-medium text-primary hover:bg-primary/5 transition-colors shadow-sm disabled:opacity-50 shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="p-3 pt-1">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="w-10 h-10 shrink-0 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Booking Calendar Modal */}
      {bookingModalExpert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/50">
            {/* Modal Header */}
            <div className="bg-primary/5 border-b border-outline-variant/50 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-on-surface text-lg">Book Appointment</h3>
                <p className="text-on-surface-variant text-[12px]">with {bookingModalExpert.name}</p>
              </div>
              <button 
                onClick={() => setBookingModalExpert(null)}
                className="p-1.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
                disabled={bookingStatus === 'booking'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex gap-4 items-center mb-6 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={bookingModalExpert.image} alt={bookingModalExpert.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-[14px] text-on-surface">{bookingModalExpert.role}</p>
                  <p className="text-[12px] text-on-surface-variant">{bookingModalExpert.price}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Select Date</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={bookingStatus === 'booking'}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        disabled={bookingStatus === 'booking'}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 text-[12px] font-bold rounded-xl transition-all border ${
                          selectedTime === time 
                          ? 'bg-primary text-on-primary border-primary' 
                          : 'bg-surface text-on-surface border-outline-variant hover:border-primary/50'
                        } disabled:opacity-50`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={bookingStatus === 'booking' || !selectedDate || !selectedTime}
                    className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-[14px] hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {bookingStatus === 'booking' ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        Confirming Booking...
                      </>
                    ) : (
                      'Confirm & Pay'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsultPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ConsultContent />
    </Suspense>
  );
}
