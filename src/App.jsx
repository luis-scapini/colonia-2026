import React, { useState, useEffect } from 'react';
// Importações via CDN compatíveis com ESM para evitar erros de build
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
  AlertTriangle
} from 'lucide-react';

const App = () => {
  // CONFIGURAÇÃO DE SEGURANÇA E AMBIENTE
  const ADMIN_PIN = "1234"; 
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [user, setUser] = useState(null);
  const [dbError, setDbError] = useState(null);

  // Verificação de segurança para as globais do sistema
  const safeGetFirebaseConfig = () => {
    try {
      if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        return JSON.parse(__firebase_config);
      }
    } catch (e) {
      console.error("Erro ao processar config do Firebase", e);
    }
    return null;
  };

  const config = safeGetFirebaseConfig();
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  const [activeWeek, setActiveWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('cronograma');
  const [completedTasks, setCompletedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para dados sincronizados
  const [students, setStudents] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para novos cadastros
  const [newStudent, setNewStudent] = useState({ nome: '', responsavel: '', periodo: 'Integral', turmaOriginal: 'Turma B', colônia: 'Exploradores' });
  const [newStaff, setNewStaff] = useState({ nome: '', periodo: 'Integral', semana: 1, funcao: 'Professor', turma: 'Exploradores' });

  // Inicialização Segura do Firebase
  useEffect(() => {
    if (!config) {
      setDbError("Ambiente de nuvem não detectado. O sistema está operando em modo offline.");
      setLoading(false);
      return;
    }

    try {
      const firebaseApp = initializeApp(config);
      const firebaseAuth = getAuth(firebaseApp);
      const firebaseDb = getFirestore(firebaseApp);

      const initAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(firebaseAuth, __initial_auth_token);
        } else {
          await signInAnonymously(firebaseAuth);
        }
      };

      initAuth();
      const unsubscribeAuth = onAuthStateChanged(firebaseAuth, setUser);

      return () => unsubscribeAuth();
    } catch (err) {
      console.error("Erro ao inicializar Firebase:", err);
      setDbError("Erro na conexão com o banco de dados.");
    }
  }, []);

  // Sincronização de Dados
  useEffect(() => {
    if (!user || !config) return;
    
    const firebaseDb = getFirestore();
    const studentsRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'students');
    const staffRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'staff');
    
    const unsubStudents = onSnapshot(studentsRef, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubStaff = onSnapshot(staffRef, (snapshot) => {
      setStaffMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubStudents();
      unsubStaff();
    };
  }, [user]);

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
    if (!isAdmin || !user || !config) return;
    const next = { "Integral": "Matutino", "Matutino": "Vespertino", "Vespertino": "Integral" };
    const collectionName = type === 'student' ? 'students' : 'staff';
    const firebaseDb = getFirestore();
    const docRef = doc(firebaseDb, 'artifacts', appId, 'public', 'data', collectionName, id);
    await updateDoc(docRef, { periodo: next[currentPeriod] });
  };

  const addStudent = async () => {
    if (!isAdmin || !newStudent.nome || !user || !config) return;
    const firebaseDb = getFirestore();
    const studentsRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'students');
    await addDoc(studentsRef, { ...newStudent, createdAt: Date.now() });
    setNewStudent({ nome: '', responsavel: '', periodo: 'Integral', turmaOriginal: 'Turma B', colônia: 'Exploradores' });
  };

  const addStaff = async () => {
    if (!isAdmin || !newStaff.nome || !user || !config) return;
    const firebaseDb = getFirestore();
    const staffRef = collection(firebaseDb, 'artifacts', appId, 'public', 'data', 'staff');
    await addDoc(staffRef, { ...newStaff, semana: activeWeek, createdAt: Date.now() });
    setNewStaff({ ...newStaff, nome: '', periodo: 'Integral', funcao: 'Professor', turma: 'Exploradores' });
  };

  const removeDocument = async (id, collectionName) => {
    if (!isAdmin || !user || !config) return;
    const firebaseDb = getFirestore();
    const docRef = doc(firebaseDb, 'artifacts', appId, 'public', 'data', collectionName, id);
    await deleteDoc(docRef);
  };

  const filteredStudents = students.filter(s => 
    s.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.responsavel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staffMembers.filter(s => s.semana === activeWeek);

  const weeks = [
    { id: 1, dates: "05/01 a 09/01", theme: "Integração e Descobertas" },
    { id: 2, dates: "12/01 a 16/01", theme: "Criatividade e Exploração" },
    { id: 3, dates: "19/01 a 23/01", theme: "Aventura e Despedida" }
  ];

  const currentData = weeks.find(w => w.id === activeWeek);

  const activities = [
    { 
      weekId: 1,
      list: [
        { day: "Segunda", title: "Gincana de Boas-vindas", baby: "Estimulação Sensorial", icon: <Star className="w-5 h-5" /> },
        { day: "Terça", title: "Esculturas de Papel", baby: "Exploração de Texturas", icon: <Palette className="w-5 h-5" /> },
        { day: "Quarta", title: "Mini-Olimpíadas", baby: "Circuito de Engatinhar", icon: <ChevronRight className="w-5 h-5" /> },
        { day: "Quinta", title: "Pintura Gigante", baby: "Pintura com Tintas Naturais", icon: <Palette className="w-5 h-5" /> },
        { day: "Sexta", title: "DIA DA ÁGUA", baby: "Brincadeiras com Bacias", icon: <Waves className="w-5 h-5" />, highlight: true },
      ]
    },
    { 
      weekId: 2,
      list: [
        { day: "Segunda", title: "Pijama + Cinema", baby: "Soneca Musical", icon: <Star className="w-5 h-5" /> },
        { day: "Terça", title: "Massinha Caseira", baby: "Cestos dos Tesouros", icon: <Palette className="w-5 h-5" /> },
        { day: "Quarta", title: "Lab. de Ciências", baby: "Garrafas Sensoriais", icon: <FlaskConical className="w-5 h-5" /> },
        { day: "Quinta", title: "Teatro Fantoches", baby: "Hora do Conto", icon: <Users className="w-5 h-5" /> },
        { day: "Sexta", title: "Baile de Máscaras", baby: "Desfile Colorido", icon: <Star className="w-5 h-5" /> },
      ]
    },
    { 
      weekId: 3,
      list: [
        { day: "Segunda", title: "Circuito de Obstáculos", baby: "Túnel de Almofadas", icon: <ChevronRight className="w-5 h-5" /> },
        { day: "Terça", title: "Brinquedos de Sucata", baby: "Brincar com Caixas", icon: <Palette className="w-5 h-5" /> },
        { day: "Quarta", title: "Show de Talentos", baby: "Roda de Música", icon: <Star className="w-5 h-5" /> },
        { day: "Quinta", title: "Picnic Cooperativo", baby: "Lanche Especial", icon: <Coffee className="w-5 h-5" /> },
        { day: "Sexta", title: "ENCERRAMENTO", baby: "Lembranças", icon: <Star className="w-5 h-5" />, highlight: true },
      ]
    }
  ];

  const currentWeekActivities = activities.find(a => a.weekId === activeWeek).list;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Modal de PIN Administrador */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Modo Administrador</h2>
              <p className="text-slate-500 text-sm mt-1">Digite o PIN para habilitar edições</p>
            </div>
            <input 
              type="password" placeholder="••••" value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              className={`w-full text-center text-2xl tracking-[1em] p-3 bg-slate-100 rounded-xl border-2 outline-none transition-all ${authError ? 'border-red-500' : 'border-transparent focus:border-blue-500'}`}
              autoFocus
            />
            {authError && <p className="text-red-500 text-xs mt-2 text-center font-bold uppercase tracking-widest">PIN Incorreto</p>}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => {setShowPinModal(false); setAuthError(false); setPinInput("");}} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={handleAuth} className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700">Acessar</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Fixo */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tighter">Colônia de Férias 2026 🚀</h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest opacity-70">Escola Interna | Berçário e Exploradores</p>
            </div>
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowPinModal(true)}
              className={`p-2 rounded-full transition-all flex items-center gap-2 group ${isAdmin ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400 border border-slate-200 hover:text-blue-500 hover:bg-blue-50'}`}
              title={isAdmin ? "Modo Edição Ativado" : "Clique para Editar"}
            >
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="text-[10px] font-bold pr-1">{isAdmin ? "ADMIN" : "LEITURA"}</span>
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {['cronograma', 'alunos', 'jornadas', 'checklists'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab === 'cronograma' ? 'Agenda' : tab === 'alunos' ? 'Alunos' : tab === 'jornadas' ? 'Jornadas' : 'Materiais'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Aviso de Erro de Banco */}
        {dbError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="font-medium italic">{dbError}</p>
          </div>
        )}

        {/* AGENDA SEMANAL */}
        {activeTab === 'cronograma' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
                <h2 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wider text-left pl-2">Semanas</h2>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                  {weeks.map(w => (
                    <button key={w.id} onClick={() => setActiveWeek(w.id)}
                      className={`p-3 rounded-xl border transition-all ${activeWeek === w.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                      <div className="font-bold text-xs uppercase tracking-widest text-left tracking-tighter">Semana {w.id}</div>
                      <div className="text-[10px] opacity-70 text-left italic">{w.dates}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h3 className="font-bold text-amber-900 flex items-center gap-2 text-xs mb-1 uppercase tracking-tighter"><Timer className="w-3 h-3" /> Lanche Coletivo</h3>
                <p className="text-[10px] text-amber-800 italic">Pausa programada às 15:00 para todos os grupos.</p>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-3 uppercase tracking-wide tracking-tighter">
                  {currentData.theme}
                </h2>
                <div className="space-y-4">
                  {currentWeekActivities.map((act, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-12 gap-4 ${act.highlight ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                      <div className="md:col-span-2 text-center md:text-left">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1 tracking-widest">{act.day}</span>
                        <div className={`p-2 rounded-lg inline-block ${act.highlight ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {act.icon}
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1 tracking-tighter"><Smile className="w-3 h-3"/> Exploradores (Maiores)</h4>
                        <p className="font-bold text-slate-800 text-sm tracking-tight">{act.title}</p>
                      </div>
                      <div className="md:col-span-5 bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                        <h4 className="text-[10px] font-bold text-pink-600 uppercase mb-1 flex items-center gap-1 tracking-tighter"><Baby className="w-3 h-3"/> Berçário (Baby)</h4>
                        <p className="text-pink-900 text-xs italic font-medium tracking-tight">"{act.baby}"</p>
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
            {isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-blue-600 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 italic uppercase tracking-tighter">
                  <UserPlus className="w-4 h-4 text-blue-600" /> Cadastrar Criança na Colônia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input type="text" placeholder="Nome Completo" value={newStudent.nome} onChange={e => setNewStudent({...newStudent, nome: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Responsável" value={newStudent.responsavel} onChange={e => setNewStudent({...newStudent, responsavel: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
                  <select value={newStudent.periodo} onChange={e => setNewStudent({...newStudent, periodo: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Integral">Integral</option><option value="Matutino">Matutino</option><option value="Vespertino">Vespertino</option>
                  </select>
                  <select value={newStudent.colônia} onChange={e => setNewStudent({...newStudent, colônia: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Exploradores">Exploradores</option><option value="Berçário">Berçário</option>
                  </select>
                  <button onClick={addStudent} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md">
                    <Plus className="w-4 h-4" /> Salvar
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
                <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800 tracking-tight tracking-tighter italic">
                  <Users className="w-5 h-5 text-blue-500" /> Lista de Frequência
                </h2>
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" />
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? <div className="p-10 text-center text-slate-400 italic font-medium tracking-tighter">Sincronizando com Banco de Dados...</div> : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-black tracking-[0.15em] border-b border-slate-200 italic">
                      <tr><th className="px-6 py-4">Criança / Responsável</th><th className="px-6 py-4 text-center">Turno</th><th className="px-6 py-4 text-center">Grupo Colônia</th><th className="px-6 py-4">Turma Orig.</th>{isAdmin && <th className="px-6 py-4 text-center">Ação</th>}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{s.nome}<div className="text-[9px] text-slate-400 font-medium italic">{s.responsavel}</div></td>
                          <td className="px-6 py-4 text-center">
                            <button disabled={!isAdmin} onClick={() => togglePeriod(s.id, s.periodo, 'student')}
                              className={`w-32 py-1.5 rounded-full text-[9px] font-bold uppercase transition-all border ${!isAdmin ? 'cursor-default' : 'hover:scale-105 shadow-sm active:scale-95'} ${
                                s.periodo === "Integral" ? "bg-green-600 text-white border-green-700 shadow-sm" :
                                s.periodo === "Matutino" ? "bg-blue-500 text-white border-blue-600 shadow-sm" :
                                "bg-orange-500 text-white border-orange-600 shadow-sm"
                              }`}> {s.periodo} </button>
                          </td>
                          <td className="px-6 py-4 text-center font-bold tracking-tight"><span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border-b-2 shadow-sm ${s.colônia === "Berçário" ? "bg-pink-100 text-pink-700 border-pink-300" : "bg-indigo-100 text-indigo-700 border-indigo-300"}`}> {s.colônia} </span></td>
                          <td className="px-6 py-4 text-slate-500 font-bold uppercase text-[10px] italic">{s.turmaOriginal}</td>
                          {isAdmin && <td className="px-6 py-4 text-center"><button onClick={() => removeDocument(s.id, 'students')} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button></td>}
                        </tr>
                      )) : <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">Nenhum aluno cadastrado no momento.</td></tr>}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* JORNADAS */}
        {activeTab === 'jornadas' && (
          <div className="space-y-6">
            {isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-indigo-600 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 italic uppercase tracking-tighter"><Briefcase className="w-4 h-4 text-indigo-600" /> Escalar Colaborador - S{activeWeek}</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <input type="text" placeholder="Nome do Funcionário" value={newStaff.nome} onChange={e => setNewStaff({...newStaff, nome: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2" />
                  <select value={newStaff.funcao} onChange={e => setNewStaff({...newStaff, funcao: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"><option value="Professor">Professor</option><option value="Auxiliar">Auxiliar</option><option value="Coordenador">Coordenador</option></select>
                  <select value={newStaff.turma} onChange={e => setNewStaff({...newStaff, turma: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"><option value="Exploradores">Exploradores</option><option value="Berçário">Berçário</option><option value="Geral">Geral</option></select>
                  <select value={newStaff.periodo} onChange={e => setNewStaff({...newStaff, periodo: e.target.value})} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"><option value="Integral">Integral</option><option value="Matutino">Matutino</option><option value="Vespertino">Vespertino</option></select>
                  <button onClick={addStaff} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"><Plus className="w-4 h-4" /> Escalar </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <h2 className="font-bold text-slate-800 mb-4 text-[10px] uppercase tracking-[0.2em] opacity-60 italic">Filtro de Semanas</h2>
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                    {weeks.map(w => (
                      <button key={w.id} onClick={() => setActiveWeek(w.id)} className={`p-3 rounded-xl border transition-all ${activeWeek === w.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}><div className="font-bold text-xs uppercase tracking-widest text-left tracking-tighter italic">Semana {w.id}</div></button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800 uppercase tracking-tighter italic">Equipe Jornada: Semana {activeWeek}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 italic">
                      <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-black tracking-widest border-b border-slate-200 italic">
                        <tr><th className="px-6 py-4">Colaborador</th><th className="px-6 py-4">Função</th><th className="px-6 py-4 text-center">Vínculo</th><th className="px-6 py-4 text-center">Turno</th>{isAdmin && <th className="px-6 py-4 text-center">Ação</th>}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 italic">
                        {filteredStaff.length > 0 ? filteredStaff.map((s) => (
                          <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-4 font-bold">{s.nome}</td>
                            <td className="px-6 py-4"><div className="flex items-center gap-2"><GraduationCap className="w-3 h-3 text-slate-400" />{s.funcao}</div></td>
                            <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded-md text-[9px] font-bold ${s.turma === "Berçário" ? "bg-pink-100 text-pink-600" : s.turma === "Exploradores" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}>{s.turma}</span></td>
                            <td className="px-6 py-4 text-center">
                              <button disabled={!isAdmin} onClick={() => togglePeriod(s.id, s.periodo, 'staff')} className={`w-32 py-1.5 rounded-full text-[9px] font-bold uppercase transition-all border ${!isAdmin ? 'cursor-default' : 'hover:scale-105 shadow-sm active:scale-95'} ${s.periodo === "Integral" ? "bg-green-600 text-white border-green-700" : s.periodo === "Matutino" ? "bg-blue-500 text-white border-blue-600" : "bg-orange-500 text-white border-orange-600"}`}>{s.periodo}</button>
                            </td>
                            {isAdmin && <td className="px-6 py-4 text-center"><button onClick={() => removeDocument(s.id, 'staff')} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button></td>}
                          </tr>
                        )) : <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">Equipe não escalada para esta semana.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHECKLISTS */}
        {activeTab === 'checklists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest border-b pb-2 italic"><CheckSquare className="w-4 h-4 text-green-500" /> Checklist de Materiais</h2>
              <div className="space-y-3">
                {["Tintas Naturais (Alimentícias)", "Rolo de Papel Pardo", "Bexigas de Água", "Bacias de Plástico", "Fantasias/Adereços", "Certificados Explorador"].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer group hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all shadow-inner" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight italic">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-indigo-800 text-white p-6 rounded-2xl shadow-lg h-fit">
              <h3 className="font-bold mb-3 flex items-center gap-2 italic text-sm underline underline-offset-4 font-serif text-amber-200"><Info className="w-4 h-4" /> Protocolo de Segurança</h3>
              <p className="text-[11px] leading-relaxed opacity-95 font-medium italic font-serif">A contagem dos 14 alunos é mandatória em cada transição. Berçário: Foco total em sono e higiene. Exploradores: Lucca e Miguel (1º ano) atuam como ajudantes monitores nas gincanas cooperativas.</p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-slate-400 text-[9px] uppercase tracking-[0.4em] font-black italic">
        © 2026 ADMINISTRAÇÃO ESCOLAR - COLÔNIA DE FÉRIAS
      </footer>
    </div>
  );
};

export default App;