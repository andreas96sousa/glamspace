"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Business } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LogOut, 
  Scissors, 
  Store, 
  User, 
  Phone, 
  CalendarClock, 
  Settings, 
  ShieldAlert, 
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";

const MOCK_SALONS: Business[] = [
  {
    id: "salon-1",
    name: "Glamour Cabelos & Arte",
    slug: "glamour-cabelos",
    address: "Rua Augusta, 1000",
    city: "São Paulo",
    ownerId: "owner-1",
    ownerName: "Ana Paula Silva",
    ownerPhone: "(11) 98765-4321",
    plan: "premium",
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    services: []
  },
  {
    id: "salon-2",
    name: "Barbearia Vintage",
    slug: "barbearia-vintage",
    address: "Av. Paulista, 500",
    city: "São Paulo",
    ownerId: "owner-2",
    ownerName: "Carlos Pereira",
    ownerPhone: "(11) 91234-5678",
    plan: "free",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    services: []
  },
  {
    id: "salon-3",
    name: "Stúdio Neon Infinity",
    slug: "studio-neon",
    address: "Av. Faria Lima, 200",
    city: "São Paulo",
    ownerId: "owner-3",
    ownerName: "Vanessa Castro",
    ownerPhone: "(11) 99887-7665",
    plan: "pro",
    expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Vencido
    services: []
  }
];

export default function SuperAdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [salons, setSalons] = useState<Business[]>(MOCK_SALONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalon, setSelectedSalon] = useState<Business | null>(null);
  
  // Modal state fields
  const [editPlan, setEditPlan] = useState<Business["plan"]>("free");
  const [editDays, setEditDays] = useState<number>(30);

  const getDaysLeft = (dateString?: string) => {
    if (!dateString) return 0;
    const target = new Date(dateString);
    const diffTime = target.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleOpenConfig = (salon: Business) => {
    setSelectedSalon(salon);
    setEditPlan(salon.plan || "free");
    setEditDays(getDaysLeft(salon.expiresAt));
  };

  const handleSavePrivileges = () => {
    if (!selectedSalon) return;
    
    // Calcula nova data baseado nos dias
    const newExpires = new Date();
    newExpires.setDate(newExpires.getDate() + Number(editDays));

    setSalons(prev => prev.map(s => {
      if (s.id === selectedSalon.id) {
        return {
          ...s,
          plan: editPlan,
          expiresAt: newExpires.toISOString()
        };
      }
      return s;
    }));
    
    setSelectedSalon(null);
  };

  const filteredSalons = salons.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Header Neon */}
      <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 font-black text-xl tracking-tighter">
          <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 p-2 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">G-Space SuperAdmin</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right mr-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master,</p>
            <p className="text-sm font-bold text-white">{user?.email || "admin@glamspace.com"}</p>
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

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Top Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/5 bg-slate-900/30 backdrop-blur-xl rounded-[2rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Store className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total de Salões</p>
                <p className="text-3xl font-black">{salons.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/5 bg-slate-900/30 backdrop-blur-xl rounded-[2rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <CalendarClock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Vencendo em breve</p>
                <p className="text-3xl font-black">
                  {salons.filter(s => getDaysLeft(s.expiresAt) > 0 && getDaysLeft(s.expiresAt) <= 5).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-slate-900/30 backdrop-blur-xl rounded-[2rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Inadimplentes</p>
                <p className="text-3xl font-black text-red-400">
                  {salons.filter(s => getDaysLeft(s.expiresAt) <= 0).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List view */}
        <Card className="border-white/5 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
            <div>
              <CardTitle className="text-xl font-bold">Gestão de Licenças</CardTitle>
              <CardDescription className="text-slate-400">Controle rigoroso dos SaaS contratados.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar salão..." 
                className="pl-10 h-10 rounded-xl bg-slate-950/50 border-white/10 focus:border-cyan-500/50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Salão</th>
                  <th className="px-6 py-4">Proprietário</th>
                  <th className="px-6 py-4">Contato (WhatsApp)</th>
                  <th className="px-6 py-4">Plano</th>
                  <th className="px-6 py-4">Vencimento</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSalons.map((salon) => {
                  const daysLeft = getDaysLeft(salon.expiresAt);
                  const isExpired = daysLeft <= 0;
                  const isWarning = daysLeft > 0 && daysLeft <= 5;
                  
                  return (
                    <tr key={salon.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex flex-shrink-0 items-center justify-center border border-cyan-500/20">
                            <Scissors className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="font-bold text-white">{salon.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-300 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" /> {salon.ownerName || "Não Info"}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-300">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" /> {salon.ownerPhone || "Não Info"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-white/10 uppercase tracking-widest text-[10px]">
                          {salon.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-black ${isExpired ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-400"}`}>
                            {isExpired ? "Vencido" : `${daysLeft} dias restantes`}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {salon.expiresAt ? format(new Date(salon.expiresAt), "dd/MM/yyyy", { locale: ptBR }) : "--"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenConfig(salon)}
                          className="rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 transition-colors gap-2"
                        >
                          <Settings className="w-4 h-4" /> Configurar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {filteredSalons.length === 0 && (
              <div className="p-8 text-center text-slate-500 italic">
                Nenhum salão encontrado.
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Privileges Modal */}
      <Dialog open={!!selectedSalon} onOpenChange={(open) => !open && setSelectedSalon(null)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white rounded-[2rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
          
          <DialogHeader className="relative">
            <DialogTitle className="text-xl font-black">Painel de Privilégios</DialogTitle>
            <DialogDescription className="text-slate-400">
              Gerencie manualmente o acesso de <strong className="text-cyan-400">{selectedSalon?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4 relative">
            <div className="grid gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plano do Salão</label>
              <div className="grid grid-cols-3 gap-2">
                {["free", "pro", "premium"].map(p => (
                  <button
                    key={p}
                    onClick={() => setEditPlan(p as any)}
                    className={`p-2 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all 
                      ${editPlan === p 
                        ? "bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dias Restantes</label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={editDays}
                  onChange={(e) => setEditDays(Number(e.target.value))}
                  className="bg-slate-950/50 border-white/10 rounded-xl h-12 text-lg font-bold w-full focus:border-cyan-500"
                />
                <span className="text-slate-500 font-medium">dias</span>
              </div>
              <p className="text-[10px] text-slate-500">Defina um valor negativo para simular atraso/vencimento.</p>
            </div>
          </div>
          
          <DialogFooter className="relative">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedSalon(null)}
              className="rounded-xl border border-white/5 hover:bg-white/10 text-slate-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSavePrivileges}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:brightness-110"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
