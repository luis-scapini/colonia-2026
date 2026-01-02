import React, { useState } from 'react';
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
  GraduationCap
} from 'lucide-react';

const App = () => {
  // CONFIGURAÇÃO DE SEGURANÇA
  const ADMIN_PIN = "101989"; // Mude sua senha aqui
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeWeek, setActiveWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('cronograma');
  const [completedTasks, setCompletedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para novos cadastros
  const [newStudent, setNewStudent] = useState({ nome: '', responsavel: '', periodo: 'Integral', turmaOriginal: 'Turma B', colônia: 'Exploradores' });
  const [newStaff, setNewStaff] = useState({ nome: '', periodo: 'Integral', semana: 1, funcao: 'Professor', turma: 'Exploradores' });

  // Lista de Alunos
  const [students, setStudents] = useState([
    { id: 1, nome: "Arthur Henrique Corá de Paula", responsavel: "Simone Cristiani Zeni Corá", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 2, nome: "Dom Peccin Dorini", responsavel: "Ellen Cristina Peccin Ferreira Dorini", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 3, nome: "Emanuel Levi Franco Scur Ewuame", responsavel: "Maria Eduarda Franco Scur", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 4, nome: "Francisco Drey Signori", responsavel: "Karen das Graças Drey", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 5, nome: "Gabrielly Crittina Calderoli Nunes", responsavel: "Monize Calderoli", periodo: "Integral", turmaOriginal: "Turma A", colônia: "Berçário" },
    { id: 6, nome: "Isabel Piovezan Hilla", responsavel: "Gessica Piovezan", periodo: "Integral", turmaOriginal: "Turma A", colônia: "Berçário" },
    { id: 7, nome: "Lara Sivieiro", responsavel: "Talita S. Bazi Siviero", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 8, nome: "Laura Casagrande Ramos", responsavel: "Edinei Ramos", periodo: "Integral", turmaOriginal: "Turma A", colônia: "Berçário" },
    { id: 9, nome: "Lorenzo Buselato de Campos", responsavel: "Tanicler Buselato Alves de Campos", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 10, nome: "Lucca Maziero de Lima", responsavel: "Camila Maziero", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 11, nome: "Luiz Otávio Schmidke Garcia", responsavel: "Joseani Schmidke", periodo: "Integral", turmaOriginal: "Turma A", colônia: "Berçário" },
    { id: 12, nome: "Maria Clara Zanini de Mello", responsavel: "Schaiane Zanini", periodo: "Integral", turmaOriginal: "Turma A", colônia: "Berçário" },
    { id: 13, nome: "Maria Júlia Mittelstaedt Teixeira", responsavel: "Julie Fátima Mittelstaedt", periodo: "Matutino", turmaOriginal: "Turma B", colônia: "Exploradores" },
    { id: 14, nome: "Miguel Angelo Alves Baretta", responsavel: "Elizania Gabriela Alves Baretta", periodo: "Integral", turmaOriginal: "Turma B", colônia: "Exploradores" },
  ]);

  // Lista de Colaboradores (Jornadas)
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, nome: "Coordenador Principal", periodo: "Integral", semana: 1, funcao: "Coordenador", turma: "Geral" },
  ]);

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

  const togglePeriod = (id, type) => {
    if (!isAdmin) return;
    const setter = type === 'student' ? setStudents : setStaffMembers;
    setter(prev => prev.map(item => {
      if (item.id === id) {
        const next = {
          "Integral": "Matutino",
          "Matutino": "Vespertino",
          "Vespertino": "Integral"
        };
        return { ...item, periodo: next[item.periodo] };
      }
      return item;
    }));
  };

  const addStudent = () => {
    if (!isAdmin || !newStudent.nome) return;
    setStudents([...students, { ...newStudent, id: Date.now() }]);
    setNewStudent({ nome: '', responsavel: '', periodo: 'Integral', turmaOriginal: 'Turma B', colônia: 'Exploradores' });
  };

  const addStaff = () => {
    if (!isAdmin || !newStaff.nome) return;
    setStaffMembers([...staffMembers, { ...newStaff, id: Date.now(), semana: activeWeek }]);
    setNewStaff({ ...newStaff, nome: '' });
  };

  const removeStudent = (id) => {
    if (!isAdmin) return;
    setStudents(students.filter(s => s.id !== id));
  };

  const removeStaff = (id) => {
    if (!isAdmin) return;
    setStaffMembers(staffMembers.filter(s => s.id !== id));
  };

  const filteredStudents = students.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Modal de PIN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="text-blue-600 w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Modo Administrador</h2>
              <p className="text-slate-500 text-sm mt-1">Digite o PIN para habilitar edições</p>
            </div>
            <input 
              type="password" 
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              className={`w-full text-center text-2xl tracking-[1em] p-3 bg-slate-100 rounded-xl border-2 outline-none transition-all ${authError ? 'border-red-500 animate-pulse' : 'border-transparent focus:border-blue-500'}`}
              autoFocus
            />
            {authError && <p className="text-red-500 text-xs mt-2 text-center font-bold uppercase">PIN Incorreto</p>}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={() => {setShowPinModal(false); setAuthError(false); setPinInput("");}}
                className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAuth}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Fixo */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tighter">
                Colônia de Férias 2026 🚀
              </h1>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest opacity-70">Escola Interna | Berçário e Exploradores</p>
            </div>
            {/* Botão de Admin */}
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowPinModal(true)}
              className={`p-2 rounded-full transition-all flex items-center gap-2 group ${isAdmin ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-400 border border-slate-200 hover:text-blue-500 hover:bg-blue-50'}`}
              title={isAdmin ? "Modo Edição Ativado" : "Clique para Editar"}
            >
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="text-[10px] font-bold pr-1">{isAdmin ? "ADMIN" : "LEITURA"}</span>
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {['cronograma', 'alunos', 'jornadas', 'checklists'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'cronograma' ? 'Agenda' : tab === 'alunos' ? 'Alunos' : tab === 'jornadas' ? 'Jornadas' : 'Materiais'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* ABA 1: CRONOGRAMA */}
        {activeTab === 'cronograma' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
                <h2 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wider">Selecionar Semana</h2>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                  {weeks.map(w => (
                    <button key={w.id} onClick={() => setActiveWeek(w.id)}
                      className={`p-3 rounded-xl border transition-all ${activeWeek === w.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600'}`}>
                      <div className="font-bold text-xs uppercase tracking-widest">S{w.id}</div>
                      <div className="text-[10px] opacity-70">{w.dates}</div>
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
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-l-4 border-blue-600 pl-3 uppercase tracking-wide">
                  {currentData.theme}
                </h2>
                <div className="space-y-4">
                  {currentWeekActivities.map((act, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-12 gap-4 ${act.highlight ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'}`}>
                      <div className="md:col-span-2 text-center md:text-left">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">{act.day}</span>
                        <div className={`p-2 rounded-lg inline-block ${act.highlight ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {act.icon}
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <h4 className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1"><Smile className="w-3 h-3"/> Exploradores</h4>
                        <p className="font-bold text-slate-800 text-sm tracking-tight">{act.title}</p>
                      </div>
                      <div className="md:col-span-5 bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                        <h4 className="text-[10px] font-bold text-pink-600 uppercase mb-1 flex items-center gap-1"><Baby className="w-3 h-3"/> Berçário</h4>
                        <p className="text-pink-900 text-xs italic font-medium tracking-tight">"{act.baby}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: ALUNOS */}
        {activeTab === 'alunos' && (
          <div className="space-y-6">
            {isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-blue-600 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 italic uppercase tracking-tighter">
                  <UserPlus className="w-4 h-4 text-blue-600" /> Cadastrar Criança na Colônia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input 
                    type="text" placeholder="Nome Completo" 
                    value={newStudent.nome} 
                    onChange={e => setNewStudent({...newStudent, nome: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="text" placeholder="Pai/Mãe" 
                    value={newStudent.responsavel} 
                    onChange={e => setNewStudent({...newStudent, responsavel: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select 
                    value={newStudent.periodo} 
                    onChange={e => setNewStudent({...newStudent, periodo: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Integral">Integral</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                  <select 
                    value={newStudent.colônia} 
                    onChange={e => setNewStudent({...newStudent, colônia: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Exploradores">Exploradores</option>
                    <option value="Berçário">Berçário</option>
                  </select>
                  <button 
                    onClick={addStudent}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Salvar
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
                <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800 tracking-tight">
                  <Users className="w-5 h-5 text-blue-500" /> Lista de Frequência
                </h2>
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" placeholder="Filtrar por nome ou responsável..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" 
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-black tracking-[0.15em] border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Criança / Responsável</th>
                      <th className="px-6 py-4 text-center">Turno</th>
                      <th className="px-6 py-4 text-center">Grupo Colônia</th>
                      <th className="px-6 py-4">Turma Orig.</th>
                      {isAdmin && <th className="px-6 py-4 text-center">Ação</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{s.nome}</div>
                          <div className="text-[9px] text-slate-400 font-medium italic">{s.responsavel}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            disabled={!isAdmin}
                            onClick={() => togglePeriod(s.id, 'student')}
                            className={`w-32 py-1.5 rounded-full text-[9px] font-bold uppercase transition-all border ${!isAdmin ? 'cursor-default' : 'hover:scale-105 shadow-sm active:scale-95'} ${
                              s.periodo === "Integral" ? "bg-green-600 text-white border-green-700" :
                              s.periodo === "Matutino" ? "bg-blue-500 text-white border-blue-600" :
                              "bg-orange-500 text-white border-orange-600"
                            }`}>
                            {s.periodo}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center font-bold tracking-tight">
                          <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border-b-2 shadow-sm ${
                            s.colônia === "Berçário" ? "bg-pink-100 text-pink-700 border-pink-300" : "bg-indigo-100 text-indigo-700 border-indigo-300"
                          }`}>
                            {s.colônia}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-bold uppercase text-[10px]">{s.turmaOriginal}</td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => removeStudent(s.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: JORNADAS */}
        {activeTab === 'jornadas' && (
          <div className="space-y-6">
            {isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-indigo-600 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 italic uppercase tracking-tighter">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Escalar Colaborador - S{activeWeek}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <input 
                    type="text" placeholder="Nome Completo" 
                    value={newStaff.nome} 
                    onChange={e => setNewStaff({...newStaff, nome: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                  />
                  <select 
                    value={newStaff.funcao} 
                    onChange={e => setNewStaff({...newStaff, funcao: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Auxiliar">Auxiliar</option>
                    <option value="Coordenador">Coordenador</option>
                  </select>
                  <select 
                    value={newStaff.turma} 
                    onChange={e => setNewStaff({...newStaff, turma: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Exploradores">Exploradores</option>
                    <option value="Berçário">Berçário</option>
                    <option value="Geral">Geral</option>
                  </select>
                  <select 
                    value={newStaff.periodo} 
                    onChange={e => setNewStaff({...newStaff, periodo: e.target.value})}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Integral">Integral</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                  <button 
                    onClick={addStaff}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Escalar
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <h2 className="font-bold text-slate-800 mb-4 text-[10px] uppercase tracking-[0.2em] opacity-60">Filtrar por Semana</h2>
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                    {weeks.map(w => (
                      <button key={w.id} onClick={() => setActiveWeek(w.id)}
                        className={`p-3 rounded-xl border transition-all ${activeWeek === w.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600'}`}>
                        <div className="font-bold text-xs uppercase tracking-widest">Semana {w.id}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800 uppercase tracking-tighter">
                      Equipe Jornada: Semana {activeWeek}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-black tracking-widest border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">Colaborador</th>
                          <th className="px-6 py-4">Função</th>
                          <th className="px-6 py-4 text-center">Turma Vinculada</th>
                          <th className="px-6 py-4 text-center">Turno Jornada</th>
                          {isAdmin && <th className="px-6 py-4 text-center">Ação</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStaff.length > 0 ? filteredStaff.map((s) => (
                          <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">
                                {s.nome}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <GraduationCap className="w-3 h-3" />
                                    <span className="font-medium">{s.funcao}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded-md text-[9px] font-bold ${
                                    s.turma === "Berçário" ? "bg-pink-100 text-pink-600" : 
                                    s.turma === "Exploradores" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                                }`}>
                                    {s.turma}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                disabled={!isAdmin}
                                onClick={() => togglePeriod(s.id, 'staff')}
                                className={`w-32 py-1.5 rounded-full text-[9px] font-bold uppercase transition-all border ${!isAdmin ? 'cursor-default' : 'hover:scale-105 active:scale-95 shadow-sm'} ${
                                  s.periodo === "Integral" ? "bg-green-600 text-white border-green-700" :
                                  s.periodo === "Matutino" ? "bg-blue-500 text-white border-blue-600" :
                                  "bg-orange-500 text-white border-orange-600"
                                }`}>
                                {s.periodo}
                              </button>
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 text-center">
                                <button onClick={() => removeStaff(s.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic font-medium">Nenhum colaborador escalado para S{activeWeek}.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: MATERIAIS */}
        {activeTab === 'checklists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest border-b pb-2">
                <CheckSquare className="w-4 h-4 text-green-500" /> Checklist de Materiais
              </h2>
              <div className="space-y-3">
                {["Tintas Naturais", "Rolo Papel Pardo", "Bexigas de Água", "Bacias de Banho", "Fantasias/Adereços", "Certificados"].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer group hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-indigo-800 text-white p-6 rounded-2xl shadow-lg h-fit">
              <h3 className="font-bold mb-3 flex items-center gap-2 italic text-sm underline underline-offset-4"><Info className="w-4 h-4" /> ALERTA DE SEGURANÇA</h3>
              <p className="text-[11px] leading-relaxed opacity-95 font-medium italic">
                Sempre realizar a contagem dos 14 alunos originais em cada troca de ambiente. No Berçário, o foco é 100% no bem-estar e sono. Nos Exploradores, os maiores do 1º ano são seus monitores auxiliares.
              </p>
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