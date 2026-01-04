
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate firm-grade authentication delay
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      
      <div className="z-10 w-full max-w-md px-6">
        <div className="text-center mb-10 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-3xl shadow-2xl shadow-amber-500/20 mb-6 transform rotate-3">
            <i className="fas fa-gavel text-slate-900 text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 legal-title tracking-tight">JurisAI Pro</h1>
          <p className="text-slate-400 text-sm uppercase tracking-[0.2em] font-medium">Enterprise Legal Intelligence</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl animate-slideUp">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Firm Email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                  placeholder="j.smith@silverman-law.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-slate-800 text-amber-500 focus:ring-amber-500/50" />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Stay Signed In</span>
              </label>
              <a href="#" className="text-xs text-amber-500 font-bold hover:text-amber-400 transition-colors">Forgot Credentials?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-slate-950 font-bold py-4 rounded-2xl hover:bg-amber-500 transition-all active:scale-[0.98] shadow-xl shadow-white/5 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  <span>Access Terminal</span>
                  <i className="fas fa-arrow-right text-sm"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest mb-4">Practice Management SSO</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors">
                <i className="fab fa-microsoft text-blue-400"></i>
              </button>
              <button className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-colors">
                <i className="fab fa-google text-rose-400"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-slate-500">
          <p className="text-[10px] italic leading-relaxed">
            "Justice is the constant and perpetual will to allot to every man his due."<br/>
            <span className="font-bold opacity-50">— Ulpian</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
