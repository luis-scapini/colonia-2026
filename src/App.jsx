import React, { useState, useEffect } from 'react';
// Importações otimizadas para evitar erros de 'Require' em ambientes como Vercel/Vite
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  updateDoc, 
  query 
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Info, 
  Waves, 
  Palette, 
  FlaskConical, 
  Star, 
  Coffee,
  ChevronRight,
  Clock,
  ExternalLink,
  Baby,
  Smile,
  Search,
  Timer,
  Edit2,
  Plus,
  Trash2,
  UserPlus,
  Briefcase,
  Lock,
  Unlock,
  Key,
  GraduationCap,
  AlertCircle,
  CloudOff
} from 'lucide-react';

const App = () => {
  // --- CONFIGURAÇÕES DE SEGURANÇA ---
  const ADMIN_PIN = "1234"; 
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);
  
  // --- ESTADOS DO SISTEMA ---
  const [user, setUser] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('cronograma');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados de Alunos e Jornada
  const [students, setStudents] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  // --- CONFIGURAÇÃO DO AMBIENTE (FIREBASE) ---
  const getEnvConfig = () => {
    try {
      if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        return JSON.parse(__firebase_config);
      }
    } catch (e) {
      console.warn("Configurações de nuvem não encontradas.");
    }
    return null;
  };

  const config = getEnvConfig();
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'colonia-default';

  // --- INICIALIZAÇÃO E SINCRONIZAÇÃO ---
  useEffect(() => {
    if (!config) {
      setIsOffline(true);
      setLoading(false);
      // Carrega dados iniciais padrão se estiver offline
      setStudents([
        { id: '13', nome: "Maria Júlia Mittelstaedt Teixeira", responsavel: "Julie Fátima Mittelstaedt", periodo: "Matutino", turmaOriginal: "Turma B", colônia: "Exploradores" }
      ]);
      return;
    }

    try {
      const firebaseApp = initializeApp(config);
      const firebaseAuth = getAuth(firebaseApp);
      const firebaseDb = getFirestore(firebaseApp);

      const initAuth = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        } catch (e) {
          console.error("Erro auth:", e);
          setIsOffline(true);
        }
      };

      initAuth();
      const unsubAuth = onAuthStateChanged(firebaseAuth, (currUser) => {
        setUser(currUser);
      });

      return () => unsubAuth();
    } catch (err) {
      setIsOffline(true);
      setLoading(false);
    }
  }, []);

  // Escuta o Banco de Dados (Firestore)
  useEffect(() => {
    if (!user || !config || isOffline) return;

    const firebaseDb = getFirestore();
    const studentsRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'students');
    const staffRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'staff');

    const unsubStudents = onSnapshot(studentsRef, (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setIsOffline(true));

    const unsubStaff = onSnapshot(staffRef, (snap) => {
      setStaffMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => setIsOffline(true));

    return () => {
      unsubStudents();
      unsubStaff();
    };
  }, [user, isOffline]);

  // --- LÓGICA DE NEGÓCIO ---
  const handleAuth = () => {
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput("");
      setAuthError(false);
    } else {
      setAuthError(true);
      setPinInput("");
    }
  };

  const togglePeriod = async (id, currentPeriod, type) => {
    if (!isAdmin || isOffline) return;
    const next = { "Integral": "Matutino", "Matutino": "Vespertino", "Vespertino": "Integral" };
    const collectionName = type === 'student' ? 'students' : 'staff';
    try {
      const firebaseDb = getFirestore();
      const docRef = doc(firebaseDb, 'artifacts', appId, 'public', 'data', collectionName, id);
      await updateDoc(docRef, { periodo: next[currentPeriod] });
    } catch (e) { console.error(e); }
  };

  const [newStudent, setNewStudent] = useState({ nome: '', responsavel: '', periodo: 'Integral', turmaOriginal: 'Turma B', colônia: 'Exploradores' });
  const addStudent = async () => {
    if (!isAdmin || !newStudent.nome || isOffline) return;
    try {
      const firebaseDb = getFirestore();
      const studentsRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'students');
      await addDoc(studentsRef, { ...newStudent, createdAt: Date.now() });
      setNewStudent({ nome: '', responsavel: '', periodo: 'Integral', turmaOriginal: 'Turma B', colônia: 'Exploradores' });
    } catch (e) { console.error(e); }
  };

  const filteredStudents = students.filter(s => 
    s.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const weeks = [
    { id: 1, dates: "05/01 a 09/01", theme: "Integração e Descobertas" },
    { id: 2, dates: "12/01 a 16/01", theme: "Criatividade e Exploração" },
    { id: 3, dates: "19/01 a 23/01", theme: "Aventura e Despedida" }
  ];

  const currentData = weeks.find(w => w.id === activeWeek);
  const activities = [
    { day: "Segunda", title: "Gincana de Boas-vindas", baby: "Estimulação Sensorial", icon: <Star className="w-5 h-5" /> },
    { day: "Terça", title: "Esculturas de Papel", baby: "Exploração de Texturas", icon: <Palette className="w-5 h-5" /> },
    { day: "Quarta", title: "Mini-Olimpíadas", baby: "Circuito de Engatinhar", icon: <ChevronRight className="w-5 h-5" /> },
    { day: "Quinta", title: "Pintura Gigante", baby: "Pintura com Tintas Naturais", icon: <Palette className="w-5 h-5" /> },
    { day: "Sexta", title: "DIA DA ÁGUA", baby: "Brincadeiras com Bacias", icon: <Waves className="w-5 h-5" />, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Modal Admin */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <Key className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold">Acesso Restrito</h2>
              <p className="text-slate-500 text-sm">Digite o PIN para editar</p>
            </div>
            <input 
              type="password" placeholder="••••" value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className={`w-full text-center text-2xl p-3 bg-slate-100 rounded-xl border-2 outline-none ${authError ? 'border-red-500 animate-shake' : 'focus:border-blue-500'}`}
              autoFocus
            />
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowPinModal(false)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Voltar</button>
              <button onClick={handleAuth} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Entrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Fixo */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md"><Calendar className="w-6 h-6"/></div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">COLÔNIA 2026</h1>
              {isOffline && (
                <div className="flex items-center gap-1 text-[9px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                  <CloudOff className="w-3 h-3"/> MODO CONSULTA (OFFLINE)
                </div>
              )}
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['cronograma', 'alunos', 'jornadas', 'checklists'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                {tab === 'cronograma' ? 'Agenda' : tab === 'alunos' ? 'Alunos' : tab === 'jornadas' ? 'Equipe' : 'Check'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => isAdmin ? setIsAdmin(false) : setShowPinModal(true)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border transition-all ${isAdmin ? 'bg-green-600 text-white border-green-700' : 'bg-white text-slate-400 border-slate-200'}`}
          >
            {isAdmin ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isAdmin ? "Admin Ativo" : "Login Admin"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* AGENDA */}
        {activeTab === 'cronograma' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="font-black text-slate-800 mb-4 text-[10px] uppercase tracking-widest">Semanas</h2>
                <div className="space-y-2">
                  {weeks.map(w => (
                    <button key={w.id} onClick={() => setActiveWeek(w.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${activeWeek === w.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'}`}>
                      <div className="font-bold text-xs">Semana {w.id}</div>
                      <div className="text-[10px] opacity-70 italic">{w.dates}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-blue-900 mb-8 border-b-2 border-blue-100 pb-4 uppercase italic tracking-tighter">
                  {currentData.theme}
                </h2>
                <div className="space-y-4">
                  {activities.map((act, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border flex flex-col md:flex-row gap-6 transition-all hover:shadow-md ${act.highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                      <div className="md:w-28 shrink-0">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-2">{act.day}</span>
                        <div className={`p-3 rounded-xl inline-block ${act.highlight ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                          {act.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-2 flex items-center gap-1 tracking-tighter"><Smile className="w-3 h-3"/> Exploradores (2-6 anos)</h4>
                        <p className="font-bold text-slate-800 leading-tight text-lg">{act.title}</p>
                      </div>
                      <div className="flex-1 bg-pink-50/40 p-4 rounded-xl border border-pink-100/50">
                        <h4 className="text-[10px] font-black text-pink-500 uppercase mb-2 flex items-center gap-1 tracking-tighter"><Baby className="w-3 h-3"/> Berçário (Bebês)</h4>
                        <p className="text-pink-900 text-sm font-medium italic italic">"{act.baby}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALUNOS */}
        {activeTab === 'alunos' && (
          <div className="space-y-6">
            {isAdmin && !isOffline && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-600 animate-in fade-in duration-500">
                <h3 className="text-xs font-black text-blue-900 mb-4 uppercase tracking-tighter flex items-center gap-2">
                  <UserPlus className="w-4 h-4"/> Adicionar Criança à Lista Global
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="Nome da Criança" value={newStudent.nome} onChange={e => setNewStudent({...newStudent, nome: e.target.value})} className="px-4 py-2 bg-slate-50 rounded-lg text-xs border-0 focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Responsável" value={newStudent.responsavel} onChange={e => setNewStudent({...newStudent, responsavel: e.target.value})} className="px-4 py-2 bg-slate-50 rounded-lg text-xs border-0 focus:ring-2 focus:ring-blue-500" />
                  <select value={newStudent.periodo} onChange={e => setNewStudent({...newStudent, periodo: e.target.value})} className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold border-0 focus:ring-2 focus:ring-blue-500">
                    <option value="Integral">Integral</option><option value="Matutino">Matutino</option><option value="Vespertino">Vespertino</option>
                  </select>
                  <select value={newStudent.colônia} onChange={e => setNewStudent({...newStudent, colônia: e.target.value})} className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold border-0 focus:ring-2 focus:ring-blue-500">
                    <option value="Exploradores">Exploradores</option><option value="Berçário">Berçário</option>
                  </select>
                  <button onClick={addStudent} className="bg-blue-600 text-white font-black text-[10px] uppercase rounded-lg hover:bg-blue-700 transition-all shadow-md">Salvar</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-4">
                <h2 className="font-black text-lg text-slate-800 tracking-tighter flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600"/> LISTA DE FREQUÊNCIA
                </h2>
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" placeholder="Buscar aluno..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-200">
                    <tr><th className="px-6 py-4">Aluno / Pais</th><th className="px-6 py-4 text-center">Turno</th><th className="px-6 py-4 text-center">Colônia</th><th className="px-6 py-4">Turma Orig.</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{s.nome}<div className="text-[10px] text-slate-400 font-medium">{s.responsavel}</div></td>
                        <td className="px-6 py-4 text-center">
                          <button disabled={!isAdmin || isOffline} onClick={() => togglePeriod(s.id, s.periodo, 'student')}
                            className={`w-32 py-1.5 rounded-full text-[9px] font-black uppercase transition-all shadow-sm border ${
                              s.periodo === "Integral" ? "bg-green-600 text-white border-green-700" :
                              s.periodo === "Matutino" ? "bg-blue-500 text-white border-blue-600" :
                              "bg-orange-500 text-white border-orange-600"
                            }`}> {s.periodo} </button>
                        </td>
                        <td className="px-6 py-4 text-center font-black"><span className={`px-4 py-1 rounded text-[9px] uppercase ${s.colônia === "Berçário" ? "bg-pink-100 text-pink-600 border border-pink-200" : "bg-indigo-100 text-indigo-700 border border-indigo-200"}`}> {s.colônia} </span></td>
                        <td className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] italic">{s.turmaOriginal}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="p-12 text-center text-slate-300 italic">Nenhum aluno carregado. {isOffline && "(Sincronização desativada)"}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER AVISO */}
        {isOffline && (
          <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-orange-900 text-xs uppercase tracking-tighter">Aviso de Sincronização</h4>
              <p className="text-[10px] text-orange-800 leading-relaxed mt-1">
                Este site está rodando fora do ambiente seguro de desenvolvimento. As edições não serão salvas na nuvem automaticamente. 
                Para usar o banco de dados em seu próprio site, é necessário configurar uma conta no Google Firebase.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-slate-300 text-[9px] uppercase tracking-[0.6em] font-black italic">
        © 2026 ADMINISTRAÇÃO ESCOLAR - COLÔNIA DE FÉRIAS
      </footer>
    </div>
  );
};

export default App;