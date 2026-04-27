"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, AlertTriangle, Zap, Scissors, Star, Users, TrendingUp, UserPlus, Shield } from "lucide-react";
import { authService } from "@/services/firebase/auth";
import { motion } from "framer-motion";

export default function SetupPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleCreateTestAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.registerAdmin("admin@teste.com", "teste321");
      setAuthSuccess(true);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("Conta admin@teste.com já existe. Você pode fazer login direto.");
        setAuthSuccess(true);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    if (!user) {
      setError("Você precisa estar logado para realizar o setup.");
      return;
    }

    setLoading(true);
    setError(null);

    if (!db) {
      setError("Firebase não configurado. Adicione as chaves no arquivo .env.local.");
      setLoading(false);
      return;
    }

    try {
      const businessId = "salao-premium-pro";
      
      // 1. Create Business
      await setDoc(doc(db, "businesses", businessId), {
        name: "GlamSpace Premium Pro",
        slug: "glam-premium",
        address: "Shopping Iguatemi, Loja 10 - Fortaleza",
        city: "Fortaleza",
        ownerId: user.uid,
        plan: "pro",
        services: [
          { id: "s1", name: "Corte Executivo", price: 60, duration: 30, commission: 0.4 },
          { id: "s2", name: "Barba Terapia", price: 45, duration: 40, commission: 0.4 },
          { id: "s3", name: "Coloração Premium", price: 250, duration: 120, commission: 0.35 },
          { id: "s4", name: "Manicure & SPA", price: 70, duration: 60, commission: 0.5 },
          { id: "s5", name: "Hidratação Profunda", price: 120, duration: 45, commission: 0.3 }
        ]
      });

      // 2. Create Staff (Multiple)
      const staffRef = collection(db, "staff");
      const staffIds = [];
      const staffNames = ["Alex Mestre", "Bruna Especialista", "Ricardo Barber", "Julia Esteticista"];
      
      for (const name of staffNames) {
        const docRef = await addDoc(staffRef, {
          businessId,
          name,
          role: name.split(" ")[1],
          availableDays: [1, 2, 3, 4, 5, 6]
        });
        staffIds.push(docRef.id);
      }

      // 3. Create Mock Appointments (Past and Future)
      const appointmentsRef = collection(db, "appointments");
      const today = new Date();
      
      // Yesterday (Past for reports)
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      await addDoc(appointmentsRef, {
        businessId,
        userId: user.uid,
        staffId: staffIds[0],
        serviceId: "s1",
        date: Timestamp.fromDate(yesterday),
        status: "completed"
      });

      // Today
      await addDoc(appointmentsRef, {
        businessId,
        userId: user.uid,
        staffId: staffIds[1],
        serviceId: "s3",
        date: Timestamp.fromDate(today),
        status: "confirmed"
      });

      // Tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      await addDoc(appointmentsRef, {
        businessId,
        userId: user.uid,
        staffId: staffIds[2],
        serviceId: "s2",
        date: Timestamp.fromDate(tomorrow),
        status: "pending"
      });

      setDone(true);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Erro desconhecido ao configurar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <Card className="border-white/5 bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 w-full" />
          <CardHeader className="text-center space-y-4 pt-10">
            <div className="mx-auto bg-white/5 p-4 rounded-3xl w-fit border border-white/10 shadow-xl">
              <Star className="w-8 h-8 text-cyan-400 fill-cyan-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tighter">Setup Premium Pro</CardTitle>
              <CardDescription className="text-slate-400 text-base">Prepare o salão de exemplo com todas as funcionalidades ilimitadas.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                 <Users className="w-4 h-4 text-purple-400" />
                 <p className="text-sm font-bold">Ilimitados</p>
                 <p className="text-[10px] uppercase text-slate-500 font-black">Profissionais</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                 <TrendingUp className="w-4 h-4 text-cyan-400" />
                 <p className="text-sm font-bold">Automática</p>
                 <p className="text-[10px] uppercase text-slate-500 font-black">Comissões</p>
              </div>
            </div>

            {done ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
                <div className="p-6 bg-cyan-500/10 rounded-[2rem] border border-cyan-500/20 text-cyan-400 font-bold">
                  Agendas, Comissões e Profissionais Criados!
                </div>
                <Button 
                  className="w-full h-16 rounded-2xl bg-white text-slate-950 font-black text-xl hover:bg-cyan-400 transition-all shadow-xl" 
                  onClick={() => window.location.href = "/glam-premium"}
                >
                  Ver Salão de Exemplo
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-2">Gerenciamento de Acesso</h4>
                  <Button 
                    variant="outline"
                    className={`w-full h-14 rounded-2xl border-white/5 bg-white/5 flex items-center justify-between px-6 transition-all ${authSuccess ? "border-cyan-500/50" : "hover:border-white/20"}`}
                    onClick={handleCreateTestAccount}
                    disabled={loading || authSuccess}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <UserPlus className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Criar Login de Teste</p>
                        <p className="text-[10px] text-slate-500 font-medium">admin@teste.com</p>
                      </div>
                    </div>
                    {authSuccess ? <CheckCircle2 className="w-5 h-5 text-cyan-400" /> : <Shield className="w-4 h-4 text-slate-600" />}
                  </Button>
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-slate-900 px-4 text-slate-600">e então</span></div>
                </div>

                <Button 
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-xl shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-[1.02] active:scale-95 transition-all" 
                  onClick={handleSetup} 
                  disabled={loading || !user}
                >
                  {loading ? "Configurando..." : "Gerar Experiência Pro"}
                </Button>
                {error && <p className="text-red-400 text-center text-[10px] font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20 uppercase tracking-wider">{error}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
