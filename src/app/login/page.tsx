"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LogIn, Scissors } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.loginAdmin(email, password);
      router.push("/admin/dashboard");
    } catch (error) {
      alert("Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      alert("Erro ao entrar com Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,211,238,0.1)] rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Scissors className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter">GlamSpace</CardTitle>
            <CardDescription className="text-slate-400">Entre na revolução do agendamento</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs content... simplified for neon look */}
            <div className="space-y-6">
               <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl gap-1">
                  <button className="py-2 text-sm font-bold rounded-lg bg-cyan-500 text-slate-950">Cliente</button>
                  <button className="py-2 text-sm font-bold rounded-lg text-slate-400 hover:text-white transition-colors">Admin</button>
               </div>

               <div className="space-y-4">
                 <Button 
                    variant="outline" 
                    className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 gap-3 font-bold text-lg transition-all active:scale-95" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <LogIn className="w-5 h-5 text-cyan-400" />
                    Entrar com Google
                  </Button>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-4 text-slate-500 font-bold tracking-widest leading-none">Acesso Restrito</span></div>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <Input 
                      type="email" 
                      placeholder="E-mail Administrativo" 
                      className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-lg"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-lg"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-lg shadow-lg hover:brightness-110 transition-all" disabled={isLoading}>
                      {isLoading ? "Validando..." : "Entrar no Painel"}
                    </Button>
                  </form>
               </div>
            </div>
          </CardContent>
          <CardFooter className="text-center text-xs font-bold text-slate-500 justify-center uppercase tracking-widest pb-8">
            © 2026 GlamSpace Premium
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
