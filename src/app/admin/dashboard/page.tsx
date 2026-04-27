"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { appointmentService } from "@/services/firebase/firestore";
import { Appointment } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Calendar as CalendarIcon, Scissors, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
    if (user) {
      setBusinessId("salao-demo-123");
    }
  }, [user]);

  useEffect(() => {
    if (businessId && date) {
      appointmentService.getByBusinessDate(businessId, date).then(setAppointments);
    }
  }, [businessId, date]);

  const handleStatusUpdate = async (id: string, status: Appointment["status"]) => {
    await appointmentService.updateStatus(id, status);
    if (date) {
      const updated = await appointmentService.getByBusinessDate(businessId, date);
      setAppointments(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Header Neon */}
      <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 font-black text-xl tracking-tighter">
          <div className="bg-cyan-500 p-2 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Scissors className="h-5 w-5 text-slate-950" />
          </div>
          <span className="hidden sm:inline">GlamSpace Admin</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right mr-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bem-vindo,</p>
            <p className="text-sm font-bold text-white">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            className="rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all gap-2" 
            onClick={async () => { await signOut(); router.push("/login"); }}
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar / Stats Glimpse */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-cyan-400" /> Selecionar Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-2xl border-white/5 bg-slate-950/50 text-slate-50"
                  locale={ptBR}
                />
              </CardContent>
            </Card>
          </motion.div>

          <Card className="border-white/5 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-[2rem] p-6 space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest text-cyan-400">Resumo de Hoje</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-black">{appointments.length}</p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Total</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-black text-cyan-400">
                  {appointments.filter(a => a.status === "confirmed").length}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Confirmados</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Agendamentos 
              <ChevronRight className="w-5 h-5 text-slate-600" />
              <span className="text-cyan-400">
                {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Hoje"}
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-20 text-center space-y-4 rounded-[2rem] border border-dashed border-white/10"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <LayoutDashboard className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium italic">Nenhum agendamento para esta data.</p>
              </motion.div>
            ) : (
              appointments.map((app, index) => (
                <motion.div 
                  key={app.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-white/5 bg-slate-900/40 rounded-[2rem] hover:bg-slate-900 hover:border-cyan-500/30 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex flex-col items-center justify-center text-cyan-400 border border-cyan-500/20">
                      <span className="text-xl font-black leading-none">{format(new Date(app.date.toDate()), "HH:mm")}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">Serviço: {app.serviceId}</h3>
                      <p className="text-sm text-slate-500 font-medium">Equipe: {app.staffId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <Badge className={`rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${
                      app.status === "confirmed" ? "bg-cyan-500/20 text-cyan-400" : 
                      app.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {app.status}
                    </Badge>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-white text-slate-950 font-bold rounded-xl px-4 hover:bg-cyan-400 transition-colors" onClick={() => handleStatusUpdate(app.id!, "confirmed")}>Confirmar</Button>
                        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-red-400 rounded-xl" onClick={() => handleStatusUpdate(app.id!, "cancelled")}>X</Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
