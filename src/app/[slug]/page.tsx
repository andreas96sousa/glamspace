"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Business, Service, Staff, Appointment } from "@/types";
import { businessService, staffService, appointmentService } from "@/services/firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, MapPin, Clock, Star, ChevronLeft, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientBookingPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [bookingFinished, setBookingFinished] = useState(false);

  useEffect(() => {
    if (slug) {
      businessService.getBySlug(slug as string).then((b) => {
        setBusiness(b);
        if (b) {
          staffService.getByBusiness(b.id).then(setStaffList);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!business || !selectedService || !selectedStaff || !selectedDate) return;

    try {
      await appointmentService.create({
        userId: user.uid,
        businessId: business.id,
        staffId: selectedStaff.id,
        serviceId: selectedService.id,
        date: selectedDate,
        status: "pending"
      });
      setBookingFinished(true);
    } catch (error) {
      alert("Erro ao realizar agendamento.");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">Carregando...</div>;
  if (!business) return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">Estabelecimento não encontrado.</div>;

  if (bookingFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-6 bg-slate-950 text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle2 className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        </motion.div>
        <h1 className="text-3xl font-black tracking-tight">Agendamento Realizado!</h1>
        <p className="text-slate-400 max-w-xs">Seu agendamento foi enviado com sucesso para o {business.name}.</p>
        <Button 
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold h-14 px-8 rounded-2xl"
          onClick={() => router.push("/")}
        >
          Voltar para o Início
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-32">
      {/* Client Header */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000')] bg-cover bg-center opacity-30" />
        <div className="absolute top-6 left-6 z-20">
           <Button variant="ghost" size="icon" className="rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10" onClick={() => router.push("/")}>
              <ChevronLeft className="w-6 h-6" />
           </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-32 relative z-20 space-y-10">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-widest uppercase">
            <Scissors className="w-3 h-3" /> Bem-vindo(a)
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-md">{business.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-400" /> {business.address}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 (120 avaliações)
            </div>
          </div>
        </header>

        {/* Step 1: Services */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-cyan-400">01</span>
            Selecione o Serviço
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {business.services.map((service) => (
              <motion.div 
                key={service.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedService(service)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  selectedService?.id === service.id 
                    ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                    : "bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-lg font-bold ${selectedService?.id === service.id ? "" : "text-white"}`}>{service.name}</p>
                    <p className={`text-xs flex items-center gap-1 mt-1 font-bold uppercase tracking-tight ${selectedService?.id === service.id ? "text-slate-900/60" : "text-slate-500"}`}>
                      <Clock className="w-3 h-3" /> {service.duration} min
                    </p>
                  </div>
                  <p className="text-xl font-black">R$ {service.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Step 2: Staff */}
        <AnimatePresence>
          {selectedService && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-cyan-400">02</span>
                Escolha o Profissional
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {staffList.map((staff) => (
                  <motion.div 
                    key={staff.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedStaff(staff)}
                    className={`flex-shrink-0 w-36 p-6 rounded-3xl border cursor-pointer text-center space-y-3 transition-all ${
                      selectedStaff?.id === staff.id 
                        ? "bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                        : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto border border-white/10" />
                    <p className={`text-sm font-black ${selectedStaff?.id === staff.id ? "text-white" : ""}`}>{staff.name}</p>
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-tighter leading-none">{staff.role}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 3: Date */}
        {selectedStaff && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-cyan-400">03</span>
              Data e Horário
            </h2>
            <Card className="border-white/5 bg-slate-900/40 rounded-[2.5rem] overflow-hidden">
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="w-full text-slate-50"
                />
              </CardContent>
            </Card>
          </motion.section>
        )}
      </div>

      {/* Persistent Bottom Bar */}
      {selectedDate && selectedService && selectedStaff && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Resumo</p>
              <p className="text-sm font-bold text-white">{selectedService.name} com {selectedStaff.name}</p>
            </div>
            <Button 
              className="flex-1 h-16 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-95" 
              onClick={handleBooking}
            >
              {user ? "Confirmar Agendamento" : "Fazer Login e Agendar"}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
