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
    if (password === 'admin123') {
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
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#d1c8c1]/50">
          <h2 className="text-2xl font-serif text-primary mb-6 text-center">Админ панель</h2>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Құпия сөзді енгізіңіз" 
            className="w-full bg-secondary/20 border border-[#d1c8c1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all mb-6 text-primary"
          />
          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium transition-colors">
            Кіру
          </button>
        </form>
      </div>
    );
  }

  const totalComing = guests.filter(g => g.status.includes('Тойға келемін')).reduce((acc, curr) => acc + (curr.guest_count || 0), 0);
  const totalNotComing = guests.filter(g => g.status.includes('Келе алмаймын')).length;

  return (
    <div className="min-h-screen bg-secondary/30 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-primary">Қонақтар тізімі</h1>
          <button onClick={fetchGuests} className="text-sm bg-white border border-[#d1c8c1] px-4 py-2 rounded-lg text-primary hover:bg-secondary transition-colors">
            Жаңарту
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d1c8c1]/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-[#6b6b6b]">Барлық жауаптар</p>
              <p className="text-2xl font-serif text-primary">{guests.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d1c8c1]/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-[#6b6b6b]">Келетін адам саны</p>
              <p className="text-2xl font-serif text-emerald-600">{totalComing}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d1c8c1]/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-[#6b6b6b]">Келмейтіндер</p>
              <p className="text-2xl font-serif text-red-500">{totalNotComing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#d1c8c1]/50 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-[#6b6b6b]">Жүктелуде...</div>
          ) : guests.length === 0 ? (
            <div className="p-12 text-center text-[#6b6b6b]">Әзірге ешкім жауап берген жоқ</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 text-primary border-b border-[#d1c8c1]/50">
                    <th className="p-4 font-medium text-sm">Есімі</th>
                    <th className="p-4 font-medium text-sm">Жауабы</th>
                    <th className="p-4 font-medium text-sm">Адам саны</th>
                    <th className="p-4 font-medium text-sm">Уақыты</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest.id} className="border-b border-[#d1c8c1]/20 hover:bg-secondary/20 transition-colors">
                      <td className="p-4 text-primary font-medium">{guest.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guest.status.includes('Тойға келемін') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {guest.status.includes('Тойға келемін') ? 'Келеді' : 'Келмейді'}
                        </span>
                      </td>
                      <td className="p-4 text-[#6b6b6b]">{guest.guest_count > 0 ? guest.guest_count : '-'}</td>
                      <td className="p-4 text-sm text-[#6b6b6b]">
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
