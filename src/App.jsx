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
  Globe,
  Copy
} from 'lucide-react';

const App = () => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('cronograma');
  const [completedTasks, setCompletedTasks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Lista de Alunos corrigida com base na interpretação dos Turnos (X)
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

  const togglePeriod = (id) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const next = {
          "Integral": "Matutino",
          "Matutino": "Vespertino",
          "Vespertino": "Integral"
        };
        return { ...student, periodo: next[student.periodo] };
      }
      return student;
    }));
  };

  const filteredStudents = students.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const weeks = [
    {
      id: 1, dates: "05/01 a 09/01", theme: "Integração e Descobertas",
      activities: [
        { day: "Segunda", title: "Gincana de Boas-vindas", baby: "Estimulação Sensorial", icon: <Star className="w-5 h-5" /> },
        { day: "Terça", title: "Esculturas de Papel", baby: "Exploração de Texturas", icon: <Palette className="w-5 h-5" /> },
        { day: "Quarta", title: "Mini-Olimpíadas", baby: "Circuito de Engatinhar", icon: <ChevronRight className="w-5 h-5" /> },
        { day: "Quinta", title: "Pintura Gigante", baby: "Pintura com Tintas Naturais", icon: <Palette className="w-5 h-5" /> },
        { day: "Sexta", title: "DIA DA ÁGUA", baby: "Brincadeiras com Bacias", icon: <Waves className="w-5 h-5" />, highlight: true },
      ]
    },
    {
      id: 2, dates: "12/01 a 16/01", theme: "Criatividade e Exploração",
      activities: [
        { day: "Segunda", title: "Pijama + Cinema", baby: "Soneca Musical", icon: <Star className="w-5 h-5" /> },
        { day: "Terça", title: "Massinha Caseira", baby: "Cestos dos Tesouros", icon: <Palette className="w-5 h-5" /> },
        { day: "Quarta", title: "Lab. de Ciências", baby: "Garrafas Sensoriais", icon: <FlaskConical className="w-5 h-5" /> },
        { day: "Quinta", title: "Teatro Fantoches", baby: "Hora do Conto", icon: <Users className="w-5 h-5" /> },
        { day: "Sexta", title: "Baile de Máscaras", baby: "Desfile Colorido", icon: <Star className="w-5 h-5" /> },
      ]
    },
    {
      id: 3, dates: "19/01 a 23/01", theme: "Aventura e Despedida",
      activities: [
        { day: "Segunda", title: "Circuito de Obstáculos", baby: "Túnel de Almofadas", icon: <ChevronRight className="w-5 h-5" /> },
        { day: "Terça", title: "Brinquedos de Sucata", baby: "Brincar com Caixas", icon: <Palette className="w-5 h-5" /> },
        { day: "Quarta", title: "Show de Talentos", baby: "Roda de Música", icon: <Star className="w-5 h-5" /> },
        { day: "Quinta", title: "Picnic Cooperativo", baby: "Lanche Especial", icon: <Coffee className="w-5 h-5" /> },
        { day: "Sexta", title: "ENCERRAMENTO", baby: "Lembranças", icon: <Star className="w-5 h-5" />, highlight: true },
      ]
    }
  ];

  const currentData = weeks.find(w => w.id === activeWeek);

  const copyIframeCode = () => {
    const code = `<iframe src="SUA_URL_AQUI" width="100%" height="800px" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header Fixo */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Colônia de Férias 2026 🚀
            </h1>
            <p className="text-slate-500 text-xs italic">Gestão Escolar Interna | Berçário e Exploradores</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {['cronograma', 'alunos', 'checklists', 'publicar'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'cronograma' ? 'Agenda' : tab === 'alunos' ? 'Alunos' : tab === 'checklists' ? 'Materiais' : 'Publicar'}
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
                  {currentData.activities.map((act, idx) => (
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

        {/* ABA 2: ALUNOS (EDITÁVEL) */}
        {activeTab === 'alunos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Users className="w-5 h-5 text-blue-500" /> Controle de Alunos e Turnos
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">Clique no botão colorido para corrigir o período do aluno.</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 uppercase text-[9px] font-black tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Criança / Responsável</th>
                    <th className="px-6 py-4 text-center">Turno (Click p/ Mudar)</th>
                    <th className="px-6 py-4 text-center">Grupo Colônia</th>
                    <th className="px-6 py-4">Turma Original</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{s.nome}</div>
                        <div className="text-[9px] text-slate-400 font-medium">{s.responsavel}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => togglePeriod(s.id)}
                          className={`w-32 py-1.5 rounded-full text-[9px] font-bold uppercase transition-all shadow-sm border ${
                            s.periodo === "Integral" ? "bg-green-600 text-white border-green-700" :
                            s.periodo === "Matutino" ? "bg-blue-500 text-white border-blue-600" :
                            "bg-orange-500 text-white border-orange-600"
                          }`}>
                          {s.periodo}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border-b-2 shadow-sm ${
                          s.colônia === "Berçário" ? "bg-pink-100 text-pink-700 border-pink-300" : "bg-indigo-100 text-indigo-700 border-indigo-300"
                        }`}>
                          {s.colônia}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold uppercase text-[10px]">{s.turmaOriginal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: MATERIAIS */}
        {activeTab === 'checklists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest border-b pb-2">
                <CheckSquare className="w-4 h-4 text-green-500" /> Materiais da Semana
              </h2>
              <div className="space-y-3">
                {["Tintas Naturais", "Rolo Papel Pardo", "Bexigas de Água", "Bacias de Banho", "Fantasias/Adereços", "Certificados"].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer group hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-indigo-700 text-white p-6 rounded-2xl shadow-lg h-fit">
              <h3 className="font-bold mb-3 flex items-center gap-2 italic text-sm underline underline-offset-4"><Info className="w-4 h-4" /> NOTA DE SEGURANÇA</h3>
              <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                Sempre realizar a contagem dos 14 alunos em cada troca de ambiente. No Berçário, atenção redobrada aos horários de sono. Nos Exploradores, Lucca e Miguel (1º ano) devem ser os monitores auxiliares nas gincanas.
              </p>
            </div>
          </div>
        )}

        {/* ABA 4: PUBLICAR NO GOOGLE SITES */}
        {activeTab === 'publicar' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto border-t-4 border-blue-600">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-inner">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Publicar no Google Sites</h2>
              <p className="text-slate-500 text-[10px] mt-2 italic font-bold">SIGA OS PASSOS ABAIXO PARA INTEGRAR O PAINEL NO SITE DA ESCOLA.</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-black text-slate-700 text-[10px] uppercase mb-2">1. Gere a URL do App</h4>
                <p className="text-xs text-slate-500 mb-3">Hospede este código (Vercel ou GitHub Pages). O link gerado será sua base de acesso.</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-black text-blue-800 text-[10px] uppercase mb-2">2. No Editor do Google Sites</h4>
                <p className="text-xs text-blue-700 mb-3 font-medium">No painel à direita:</p>
                <ol className="text-xs text-blue-800 space-y-2 list-decimal ml-4 font-bold">
                  <li>Clique no botão "Incorporar" (&lt;/&gt;)</li>
                  <li>Mude para a aba "Código"</li>
                  <li>Cole o código abaixo substituindo pelo seu link:</li>
                </ol>
                <div className="mt-4 relative group">
                  <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg text-[10px] overflow-x-auto border border-slate-700 font-mono">
                    {`<iframe src="SUA_URL_AQUI" width="100%" height="800px" frameborder="0"></iframe>`}
                  </pre>
                  <button onClick={copyIframeCode} className="absolute right-2 top-2 p-1.5 bg-slate-700 text-white rounded hover:bg-slate-600 transition-all flex items-center gap-1 text-[10px] uppercase font-bold">
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-slate-400 text-[9px] uppercase tracking-[0.3em] font-black">
        © 2026 ADMINISTRAÇÃO ESCOLAR - COLÔNIA DE FÉRIAS
      </footer>
    </div>
  );
};

export default App;