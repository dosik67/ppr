import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin12211') {
      setIsAuthenticated(true);
      fetchGuests();
    } else {
      alert('Құпия сөз қате!');
    }
  };

  const fetchGuests = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setGuests(data);
    } else if (error) {
      console.error("Error fetching guests:", error);
    }
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-[Montserrat,sans-serif] bg-slate-950">
        <form onSubmit={handleLogin} className="bg-slate-900/80 p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#d4af37]/30 gold-glow">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-6 text-center tracking-widest uppercase">Админ панель</h2>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Құпия сөзді енгізіңіз" 
            className="w-full bg-slate-950 border border-[#85631c] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all mb-6 text-white"
          />
          <button type="submit" className="w-full bg-gradient-to-r from-[#85631c] via-[#d4af37] to-[#85631c] hover:opacity-90 text-slate-950 py-3 rounded-xl font-bold transition-opacity">
            Кіру
          </button>
        </form>
      </div>
    );
  }

  const totalComing = guests.filter(g => !g.status.includes('алмаймын')).reduce((acc, curr) => acc + (curr.guest_count || 0), 0);
  const totalNotComing = guests.filter(g => g.status.includes('алмаймын')).length;

  return (
    <div className="min-h-screen p-4 md:p-8 font-[Montserrat,sans-serif] bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-[#d4af37]">Қонақтар тізімі</h1>
          <button onClick={fetchGuests} className="text-sm bg-slate-900 border border-[#d4af37]/50 px-4 py-2 rounded-lg text-[#fbf5c4] hover:bg-slate-800 transition-colors">
            Жаңарту
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-[#d4af37]/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Барлық жауаптар</p>
              <p className="text-2xl font-serif text-[#fbf5c4]">{guests.length}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-[#d4af37]/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Келетін адам саны</p>
              <p className="text-2xl font-serif text-emerald-400">{totalComing}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 p-6 rounded-2xl shadow-sm border border-[#d4af37]/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center text-red-400">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Келмейтіндер</p>
              <p className="text-2xl font-serif text-red-400">{totalNotComing}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-3xl shadow-sm border border-[#d4af37]/30 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400">Жүктелуде...</div>
          ) : guests.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Әзірге ешкім жауап берген жоқ</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-[#d4af37] border-b border-[#d4af37]/30">
                    <th className="p-4 font-medium text-sm">Есімі</th>
                    <th className="p-4 font-medium text-sm">Жауабы</th>
                    <th className="p-4 font-medium text-sm">Адам саны</th>
                    <th className="p-4 font-medium text-sm">Уақыты</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest.id} className="border-b border-[#d4af37]/10 hover:bg-slate-800 transition-colors">
                      <td className="p-4 text-[#fbf5c4] font-medium">{guest.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          !guest.status.includes('алмаймын') ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'
                        }`}>
                          {!guest.status.includes('алмаймын') ? 'Келеді' : 'Келмейді'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{guest.guest_count > 0 ? guest.guest_count : '-'}</td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(guest.created_at).toLocaleString('kk-KZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
