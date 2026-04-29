"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Scissors, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Users, 
  Star, 
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
  Loader2
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planName: string, priceId: string) => {
    try {
      setLoadingPlan(planName);
      
      const user = auth?.currentUser;
      if (!user) {
        router.push("/login?redirect=pricing");
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planName,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Erro ao criar sessão de checkout:", data.error);
        alert("Ocorreu um erro ao iniciar o checkout. Verifique se as chaves do Stripe estão configuradas.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erro na conexão com o servidor.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-500/10 rounded-full blur-[120px] animation-delay-2000 animate-pulse" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-pink-500/10 rounded-full blur-[120px] animation-delay-4000 animate-pulse" />
      </div>

      <header className="sticky top-0 z-50 px-4 lg:px-8 h-20 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-black text-2xl tracking-tighter"
        >
          <div className="bg-gradient-to-br from-cyan-400 to-purple-600 p-2 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            GlamSpace
          </span>
        </motion.div>
        
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400 mr-4">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Funcionalidades</a>
            <a href="#stats" className="hover:text-cyan-400 transition-colors">Números</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Preços</a>
          </div>
          <ThemeToggle />
          <Button 
            variant="outline" 
            className="hidden sm:flex border-white/10 hover:bg-white/5"
            onClick={() => router.push("/login")}
          >
            Entrar
          </Button>
          <Button 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:scale-105"
            onClick={() => router.push("/login")}
          >
            Começar Grátis
          </Button>
        </nav>
      </header>

      <main className="flex-1 relative">
        {/* HERO SECTION */}
        <section className="relative w-full py-24 md:py-32 lg:py-17 px-4">
          <div className="container mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold tracking-wide"
            >
              <Sparkles className="w-4 h-4" />
              O FUTURO DO AGENDAMENTO CHEGOU
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 animate-gradient-x p-2">
                GlamSpace
              </span>
              <br />
              Transforme seu Salão 
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto max-w-[800px] text-slate-400 text-lg md:text-2xl leading-relaxed"
            >
              A plataforma de agendamento que coloca seu estabelecimento em outro nível. 
              Modernidade, velocidade e design premium para conquistar seus clientes.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-6 pt-4"
            >
              <Button 
                size="lg" 
                className="h-16 px-10 text-xl font-bold bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
                onClick={() => router.push("/login")}
              >
                Registrar meu Salão
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 text-xl font-bold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group"
                onClick={() => router.push("/salao-do-demo")}
              >
                Ver Demo <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Dashboard Mockup Glimpse */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-20 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-900/50 p-2 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="bg-slate-950 rounded-xl overflow-hidden aspect-video relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                      <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400" />
                   </div>
                </div>
                {/* Fake UI Elements */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section id="stats" className="py-24 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Redução de Faltas", value: "-80%", icon: <ShieldCheck className="w-6 h-6" /> },
                { label: "Economia de Tempo", value: "5h/sem", icon: <Clock className="w-6 h-6" /> },
                { label: "Faturamento Extra", value: "+25%", icon: <TrendingUp className="w-6 h-6" /> },
                { label: "Retenção de Clientes", value: "2x+", icon: <Users className="w-6 h-6" /> },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center space-y-2 p-6 rounded-2xl border border-white/5 bg-white/[0.01]"
                >
                  <div className="inline-flex p-3 rounded-xl bg-white/5 text-cyan-400 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
                  <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">O que você ganha com o GlamSpace?</h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">Tudo que seu salão precisa para crescer de forma organizada e moderna.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-10 h-10 text-cyan-400" />}
                title="Agendamento Instantâneo"
                description="Seu cliente agenda em menos de 1 minuto sem precisar ligar ou trocar mensagens."
                color="cyan"
              />
              <FeatureCard 
                icon={<Smartphone className="w-10 h-10 text-purple-400" />}
                title="Mobile First & App-like"
                description="Uma experiência de aplicativo nativo rodando diretamente no navegador do celular."
                color="purple"
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-10 h-10 text-pink-400" />}
                title="Segurança Militar"
                description="Dados criptografados e hospedados com o padrão Google de confiabilidade."
                color="pink"
              />
              <FeatureCard 
                icon={<Users className="w-10 h-10 text-blue-400" />}
                title="Gestão de Equipe"
                description="Controle múltiplos profissionais, agendas e especialidades em um só lugar."
                color="blue"
              />
              <FeatureCard 
                icon={<Calendar className="w-10 h-10 text-emerald-400" />}
                title="Calendário Dinâmico"
                description="Visualize sua semana num relance e gerencie conflitos de horário em tempo real."
                color="emerald"
              />
              <FeatureCard 
                icon={<TrendingUp className="w-10 h-10 text-amber-400" />}
                title="Analytics & Crescimento"
                description="Saiba quais serviços são mais rentáveis e quais horários são mais procurados."
                color="amber"
              />
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="py-24 bg-white/[0.02]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black mb-16">Amado por experts do setor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Carlos Silva", role: "Dono da BarberLux", text: "Mudou a forma como gerencio meu tempo. Meus clientes adoram os horários neon!" },
                { name: "Ana Costa", role: "Spazio Ana", text: "Super fácil de configurar. O suporte é impecável e o design é de outro mundo." },
                { name: "Tô Barber", role: "Referência no Sul", text: "Minha agenda vive lotada agora. O GlamSpace facilitou tudo." },
              ].map((review, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl border border-white/5 bg-slate-900 shadow-xl text-left space-y-4"
                >
                  <div className="flex text-amber-400 gap-1"><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/><Star size={16}/></div>
                  <p className="text-slate-300 italic">"{review.text}"</p>
                  <div>
                    <p className="font-bold text-white">{review.name}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{review.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Planos que cabem no seu bolso</h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">Escolha o plano ideal para a fase atual do seu estabelecimento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/50 backdrop-blur-xl space-y-8 flex flex-col"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-400">Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">R$ 59,90</span>
                    <span className="text-slate-500 text-sm">/mês</span>
                  </div>
                  <p className="text-xs text-cyan-400 font-bold tracking-wider uppercase">ou R$ 49,90 no plano anual</p>
                </div>
                
                <ul className="space-y-4 flex-1">
                  <PricingItem text="Agenda Digital (Link único)" />
                  <PricingItem text="Até 2 profissionais/colaboradores" />
                  <PricingItem text="Notificações básicas por e-mail" />
                  <PricingItem text="Painel Administrativo Mobile-First" />
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold text-lg"
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout("Starter", "price_1StarterPlaceholder")}
                >
                  {loadingPlan === "Starter" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Começar com Starter"
                  )}
                </Button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] border-2 border-cyan-500/50 bg-slate-900 relative space-y-8 flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.15)]"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-slate-950 text-xs font-black rounded-full tracking-widest uppercase">
                  Recomendado
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-cyan-400">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">R$ 109,90</span>
                    <span className="text-slate-500 text-sm">/mês</span>
                  </div>
                  <p className="text-xs text-purple-400 font-bold tracking-wider uppercase">ou R$ 99,90 no plano anual</p>
                </div>
                
                <ul className="space-y-4 flex-1">
                  <PricingItem text="Tudo do plano Starter" />
                  <PricingItem text="Profissionais ILIMITADOS" />
                  <PricingItem text="Gestão de Comissões automatizada" />
                  <PricingItem text="Relatórios de faturamento mensal" />
                  <PricingItem text="Suporte prioritário via WhatsApp" bold />
                </ul>

                <Button 
                  className="w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout("Pro", "price_1ProPlaceholder")}
                >
                  {loadingPlan === "Pro" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Quero o Plano Pro"
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 via-purple-600/30 to-pink-600/30 blur-[100px] opacity-20" />
          <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Pronto para o Próximo Nível?</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Junte-se a milhares de estabelecimentos que já modernizaram seu atendimento.</p>
            <Button 
               size="lg" 
               className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 text-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,211,238,0.4)]"
               onClick={() => router.push("/login")}
            >
              Criar minha Conta Agora
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-slate-950 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
              <Scissors className="h-6 w-6 text-cyan-400" />
              <span>GlamSpace</span>
            </div>
            <p className="text-slate-500 text-sm">Elevando o padrão de atendimento com tecnologia de ponta e design inovador.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Produto</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white">Preços</a></li>
              <li><a href="#" className="hover:text-white">Mobile App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Suporte</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white">Documentação</a></li>
              <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2026 GlamSpace. Made with Neon by Antigravity.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingItem({ text, bold }: { text: string, bold?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
      </div>
      <span className={`text-slate-300 text-sm ${bold ? "font-bold text-white" : ""}`}>{text}</span>
    </li>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "group-hover:shadow-cyan-500/20 border-cyan-500/5 hover:border-cyan-500/20",
    purple: "group-hover:shadow-purple-500/20 border-purple-500/5 hover:border-purple-500/20",
    pink: "group-hover:shadow-pink-500/20 border-pink-500/5 hover:border-pink-500/20",
    blue: "group-hover:shadow-blue-500/20 border-blue-500/5 hover:border-blue-500/20",
    emerald: "group-hover:shadow-emerald-500/20 border-emerald-500/5 hover:border-emerald-500/20",
    amber: "group-hover:shadow-amber-500/20 border-amber-500/5 hover:border-amber-500/20",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`group flex flex-col p-8 space-y-6 rounded-[2rem] border transition-all bg-white/[0.02] hover:bg-white/[0.04] shadow-2xl ${colorMap[color]}`}
    >
      <div className="p-4 w-fit rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="font-black text-2xl text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
      </div>
      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors cursor-pointer">
        Saiba mais <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
