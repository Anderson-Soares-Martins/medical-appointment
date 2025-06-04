Design de Interface para Sistema de Agendamento Médico
Baseado nos requisitos fornecidos, vou criar as interfaces em Figma para os atores Paciente e Médico, abordando os três casos de uso principais: agendar consulta, cancelar consulta e visualizar histórico de consultas.
Abordagem de Design
Criarei interfaces modernas, intuitivas e acessíveis com as seguintes características:

Paleta de cores profissional com tons azuis (confiança na área médica)
Interface responsiva para desktop e mobile
Navegação clara e consistente
Feedback visual para ações importantes

Vamos analisar cada tela para ambos os atores:
Interface do Paciente
Tela de Login
A porta de entrada para o sistema, mantendo simplicidade e segurança:

Campos para e-mail e senha bem dimensionados
Botão "Entrar" destacado
Link "Esqueci minha senha" facilmente visível
Opção para criar nova conta

Dashboard do Paciente
Centro de controle com acesso rápido a todas as funcionalidades:

Visão geral das próximas consultas
Botões grandes e intuitivos para as principais ações
Status atual de notificações
Menu de navegação consistente

Tela de Agendamento
Interface que facilita a seleção de médico, data e horário:

Filtros intuitivos para especialidade e médico
Calendário visual para seleção de data
Exibição clara de slots disponíveis por horário
Confirmação de agendamento com detalhes completos

Tela de Minhas Consultas
Visualização e gerenciamento das consultas agendadas:

Lista organizada por data e hora
Informações essenciais visíveis (médico, especialidade, local)
Botão de cancelamento com confirmação
Feedback visual após cancelamento (padrão Observer)

Tela de Histórico
Acesso organizado ao histórico médico:

Lista cronológica de consultas anteriores
Filtros por período, médico e status
Indicadores visuais de status (realizada, cancelada)
Detalhes expandíveis por consulta

Interface do Médico
Tela de Login
Similar à do paciente, mas com identidade visual que indica área profissional:

Campos para credenciais médicas
Autenticação segura
Opção de recuperação de senha

Dashboard do Médico
Visão centralizada da agenda do dia:

Próximas consultas em destaque
Indicadores visuais de status (confirmada, em espera)
Acesso rápido a agenda completa e histórico
Notificações de novos agendamentos (padrão Observer)

Tela de Gerenciamento de Consultas
Controle completo sobre a agenda:

Calendário semanal/mensal
Lista detalhada de consultas agendadas
Opções para cancelar ou remarcar
Sistema de notificação automática ao paciente

Tela de Histórico de Consultas
Histórico completo de atendimentos:

Busca avançada por paciente ou período
Filtros por tipo de consulta e status
Visualização detalhada de cada atendimento
Estatísticas de atendimentos

Princípios de Design Aplicados

Consistência: Elementos de interface padronizados entre as telas
Feedback: Confirmações visuais claras para todas as ações
Hierarquia visual: Destaque para informações e ações prioritárias
Acessibilidade: Contraste adequado e tamanhos de fonte legíveis
Eficiência: Minimização de cliques para concluir tarefas comuns

quero que implemente as seguintes telas e faça com que tenha um fluxo consiso

```
import { useState } from 'react';
import { Bell, Calendar, ClipboardList, User } from 'lucide-react';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const upcomingAppointments = [
    { id: 1, doctor: "Dra. Ana Souza", specialty: "Cardiologia", date: "15/04/2025", time: "14:30" },
    { id: 2, doctor: "Dr. Carlos Mendes", specialty: "Dermatologia", date: "22/04/2025", time: "10:15" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MediConsulta</h1>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center mr-2">
                <User size={16} />
              </div>
              <span>Olá, Maria</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{currentDate}</h2>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
            <div className="flex items-center text-blue-500 mb-2">
              <Calendar size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Agendar Consulta</h3>
            </div>
            <p className="text-gray-600">Marque uma nova consulta com o especialista de sua escolha.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
            <div className="flex items-center text-green-500 mb-2">
              <ClipboardList size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Minhas Consultas</h3>
            </div>
            <p className="text-gray-600">Gerencie suas consultas agendadas e cancelamentos.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
            <div className="flex items-center text-purple-500 mb-2">
              <ClipboardList size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Histórico</h3>
            </div>
            <p className="text-gray-600">Visualize todo o seu histórico de consultas anteriores.</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximas Consultas</h3>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-start p-4 border rounded-lg hover:bg-blue-50">
                  <div className="bg-blue-100 p-4 rounded-lg mr-4 text-center">
                    <div className="text-sm text-blue-600">{appointment.date.split('/')[0]}</div>
                    <div className="text-xl font-bold text-blue-800">{appointment.date.split('/')[1]}</div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800">{appointment.doctor}</h4>
                    <p className="text-gray-600">{appointment.specialty}</p>
                    <div className="mt-2 text-sm text-blue-600">
                      Horário: {appointment.time}
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm">
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Você não tem consultas agendadas.</p>
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <nav className="bg-white shadow-inner border-t">
        <div className="container mx-auto">
          <div className="flex justify-around">
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <User size={20} />
              <span className="text-xs mt-1">Principal</span>
            </button>
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'appointments' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={20} />
              <span className="text-xs mt-1">Consultas</span>
            </button>
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('history')}
            >
              <ClipboardList size={20} />
              <span className="text-xs mt-1">Histórico</span>
            </button>
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
```

```
import { useState } from 'react';
import { ArrowLeft, Search, Calendar, Clock, Check } from 'lucide-react';

export default function ScheduleAppointment() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const specialties = ['Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria', 'Neurologia'];

  const doctors = [
    { id: 1, name: 'Dra. Ana Souza', specialty: 'Cardiologia', rating: 4.8, photoUrl: '/api/placeholder/60/60' },
    { id: 2, name: 'Dr. Carlos Mendes', specialty: 'Dermatologia', rating: 4.9, photoUrl: '/api/placeholder/60/60' },
    { id: 3, name: 'Dra. Patrícia Lima', specialty: 'Cardiologia', rating: 4.7, photoUrl: '/api/placeholder/60/60' },
  ];

  const availableDates = ['15/04/2025', '16/04/2025', '17/04/2025', '18/04/2025', '19/04/2025'];

  const availableTimes = ['08:00', '09:30', '10:15', '11:45', '14:00', '15:30', '16:45'];

  const handleConfirmAppointment = () => {
    // Simulação de confirmação - na prática, enviaria para API
    setIsConfirmed(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center">
          <button className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Agendar Consulta</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        {/* Step Indicator */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex flex-col items-center`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s < step ? 'bg-green-500 text-white' :
                s === step ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {s < step ? <Check size={16} /> : s}
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {s === 1 ? 'Especialidade' :
                 s === 2 ? 'Médico' :
                 s === 3 ? 'Data/Hora' : 'Confirmação'}
              </span>
            </div>
          ))}
        </div>

        {isConfirmed ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Consulta Agendada!</h2>
            <p className="text-gray-600 mb-6">Sua consulta foi agendada com sucesso.</p>

            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-6">
              <div className="flex items-start mb-4">
                <img src="/api/placeholder/60/60" alt="Doctor" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="font-semibold">{selectedDoctor?.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedDoctor?.specialty}</p>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <div>
                  <p className="text-gray-500 text-sm">Data</p>
                  <p className="font-semibold">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Hora</p>
                  <p className="font-semibold">{selectedTime}</p>
                </div>
              </div>
            </div>

            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium">
              Voltar para o Início
            </button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Escolha uma especialidade</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar especialidade..."
                      className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {specialties.map((specialty) => (
                    <div
                      key={specialty}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 ${
                        selectedSpecialty === specialty ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{specialty}</span>
                        {selectedSpecialty === specialty && (
                          <Check size={20} className="text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!selectedSpecialty}
                    onClick={() => setStep(2)}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Escolha um profissional - {selectedSpecialty}</h2>

                <div className="space-y-4">
                  {doctors
                    .filter(doctor => doctor.specialty === selectedSpecialty)
                    .map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 ${
                          selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <div className="flex items-center">
                          <img src={doctor.photoUrl} alt={doctor.name} className="w-12 h-12 rounded-full mr-4" />
                          <div className="flex-grow">
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm ml-1">{doctor.rating}</span>
                            </div>
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <Check size={20} className="text-blue-600" />
                          )}
                        </div>
                      </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </button>
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!selectedDoctor}
                    onClick={() => setStep(3)}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <img src={selectedDoctor?.photoUrl} alt={selectedDoctor?.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-semibold">{selectedDoctor?.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedDoctor?.specialty}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="flex items-center text-gray-700 mb-4">
                    <Calendar size={18} className="mr-2" />
                    Selecione uma data
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {availableDates.map((date) => (
                      <div
                        key={date}
                        className={`p-3 border rounded-lg text-center cursor-pointer hover:bg-blue-50 ${
                          selectedDate === date ? 'border-blue-500 bg-blue-50 text-blue-600' : ''
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="flex items-center text-gray-700 mb-4">
                    <Clock size={18} className="mr-2" />
                    Selecione um horário
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <div
                        key={time}
                        className={`p-3 border rounded-lg text-center cursor-pointer hover:bg-blue-50 ${
                          selectedTime === time ? 'border-blue-500 bg-blue-50 text-blue-600' : ''
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg"
                    onClick={() => setStep(2)}
                  >
                    Voltar
                  </button>
                  <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(4)}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-center mb-6">Confirmar Agendamento</h2>

                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-6">
                  <div className="flex items-start mb-4">
                    <img src={selectedDoctor?.photoUrl} alt="Doctor" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h3 className="font-semibold">{selectedDoctor?.name}</h3>
                      <p className="text-gray-600 text-sm">{selectedDoctor?.specialty}</p>
                    </div>
                  </div>

                  <div className="flex justify-between border-t pt-4">
                    <div>
                      <p className="text-gray-500 text-sm">Data</p>
                      <p className="font-semibold">{selectedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Hora</p>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      Ao confirmar, você receberá uma notificação com os detalhes da consulta,
                      e o médico será notificado do seu agendamento.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between max-w-md mx-auto">
                  <button
                    className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg"
                    onClick={() => setStep(3)}
                  >
                    Voltar
                  </button>
                  <button
                    className="bg-green-600 text-white py-2 px-6 rounded-lg"
                    onClick={handleConfirmAppointment}
                  >
                    Confirmar Agendamento
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
```

```
import { useState } from 'react';
import { Calendar, Clock, User, ClipboardList, ChevronRight, Menu } from 'lucide-react';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const todayAppointments = [
    { id: 1, patient: "João Silva", time: "09:30", status: "confirmado", reason: "Consulta de rotina" },
    { id: 2, patient: "Maria Oliveira", time: "10:45", status: "confirmado", reason: "Dor no peito" },
    { id: 3, patient: "Carlos Santos", time: "14:00", status: "aguardando", reason: "Acompanhamento pós-cirurgia" },
    { id: 4, patient: "Ana Pereira", time: "16:30", status: "confirmado", reason: "Resultados de exames" }
  ];

  const upcomingAppointments = [
    { id: 5, patient: "Pedro Cardoso", date: "16/04/2025", time: "11:15", status: "confirmado" },
    { id: 6, patient: "Lúcia Ferreira", date: "16/04/2025", time: "15:30", status: "confirmado" },
    { id: 7, patient: "Miguel Costa", date: "17/04/2025", time: "08:45", status: "aguardando" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-3">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold">MediConsulta</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <div className="relative">
                <Calendar size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </div>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center mr-2">
                <User size={16} />
              </div>
              <span>Dr. Eduardo Martins</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{currentDate}</h2>
          <p className="text-gray-600">Bem-vindo de volta, Dr. Eduardo</p>
        </div>

        {/* Today's schedule */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Agenda de Hoje</h3>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              4 Consultas
            </div>
          </div>

          <div className="space-y-3">
            {todayAppointments.map(appointment => (
              <div key={appointment.id} className="flex p-4 border rounded-lg hover:bg-indigo-50">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
                    {appointment.time.split(':')[0]}h
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-800">{appointment.patient}</h4>
                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                  <div className="mt-1 flex items-center">
                    <Clock size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{appointment.time}</span>
                    <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                      appointment.status === 'confirmado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'confirmado' ? 'Confirmado' : 'Aguardando'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-indigo-500">
            <div className="flex items-center text-indigo-500 mb-2">
              <Calendar size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Gerenciar Agenda</h3>
            </div>
            <p className="text-gray-600">Gerencie suas consultas e disponibilidade.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
            <div className="flex items-center text-green-500 mb-2">
              <ClipboardList size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Histórico de Pacientes</h3>
            </div>
            <p className="text-gray-600">Acesse o histórico completo de atendimentos.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
            <div className="flex items-center text-purple-500 mb-2">
              <User size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Editar Perfil</h3>
            </div>
            <p className="text-gray-600">Atualize suas informações e especialidades.</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Próximas Consultas</h3>
            <button className="text-indigo-600 text-sm font-medium">Ver todas</button>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="flex justify-between items-center p-3 border-b">
                <div>
                  <h4 className="font-medium text-gray-800">{appointment.patient}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{appointment.date}</span>
                    <Clock size={14} className="ml-3 mr-1" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  appointment.status === 'confirmado'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status === 'confirmado' ? 'Confirmado' : 'Aguardando'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <nav className="bg-white shadow-inner border-t">
        <div className="container mx-auto">
          <div className="flex justify-around">
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <User size={20} />
              <span className="text-xs mt-1">Principal</span>
            </button>
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'appointments' ? 'text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={20} />
              <span className="text-xs mt-1">Agenda</span>
            </button>
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('history')}
            >
              <ClipboardList size={20} />
              <span className="text-xs mt-1">Histórico</span>
            </button>
            <button
              className={`p-4 flex flex-col items-center ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
```

```
import { useState } from 'react';
import { ArrowLeft, Filter, Search, Calendar, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function AppointmentHistory() {
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const appointmentHistory = [
    {
      id: 1,
      doctor: "Dra. Ana Souza",
      specialty: "Cardiologia",
      date: "10/03/2025",
      time: "14:30",
      status: "realizada",
      diagnosis: "Hipertensão Leve",
      prescription: "Losartana 50mg - 1x ao dia",
      notes: "Paciente apresentou melhora significativa após início do tratamento. Recomendada dieta com restrição de sódio."
    },
    {
      id: 2,
      doctor: "Dr. Carlos Mendes",
      specialty: "Dermatologia",
      date: "25/02/2025",
      time: "10:15",
      status: "realizada",
      diagnosis: "Dermatite Atópica",
      prescription: "Pomada de corticóide - Aplicar 2x ao dia",
      notes: "Áreas afetadas: antebraços e pescoço. Recomendado evitar banhos muito quentes."
    },
    {
      id: 3,
      doctor: "Dr. Roberto Almeida",
      specialty: "Ortopedia",
      date: "15/02/2025",
      time: "09:00",
      status: "cancelada",
      cancellationReason: "Médico indisponível"
    },
    {
      id: 4,
      doctor: "Dra. Patrícia Lima",
      specialty: "Oftalmologia",
      date: "05/01/2025",
      time: "15:45",
      status: "realizada",
      diagnosis: "Conjuntivite Alérgica",
      prescription: "Colírio antialérgico - 3x ao dia",
      notes: "Sintomas melhoraram após uma semana. Recomendado uso de óculos escuros em ambientes externos."
    }
  ];

  const toggleDetails = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  const filteredAppointments = appointmentHistory.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'realizada':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Realizada</span>;
      case 'cancelada':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Cancelada</span>;
      case 'reagendada':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Reagendada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center">
          <button className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Histórico de Consultas</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por médico ou especialidade..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="flex items-center text-gray-700 hover:text-blue-600"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={18} className="mr-2" />
              <span>Filtros</span>
              {filterOpen ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
            </button>

            <div className="text-sm text-gray-500">
              {filteredAppointments.length} consultas encontradas
            </div>
          </div>

          {filterOpen && (
            <div className="mt-4 pt-4 border-t">
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => setStatusFilter('all')}
                  >
                    Todas
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === 'realizada'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => setStatusFilter('realizada')}
                  >
                    Realizadas
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === 'cancelada'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => setStatusFilter('cancelada')}
                  >
                    Canceladas
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Período</p>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="De"
                      className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm"
                    />
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Até"
                      className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDetails(appointment.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span className="mr-3">{appointment.date}</span>
                        <Clock size={14} className="mr-1" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(appointment.status)}
                    <button className="mt-2 text-blue-600">
                      {expandedAppointment === appointment.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {expandedAppointment === appointment.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  {appointment.status === 'realizada' ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Diagnóstico</h4>
                        <p className="text-gray-800">{appointment.diagnosis}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Prescrição</h4>
                        <p className="text-gray-800">{appointment.prescription}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Observações</h4>
                        <p className="text-gray-800">{appointment.notes}</p>
                      </div>
                      <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                          Baixar Receita
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Motivo do Cancelamento</h4>
                      <p className="text-gray-800">{appointment.cancellationReason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

```
import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, FileText, Search } from 'lucide-react';

export default function ConfirmarConsulta() {
  const [consultasHoje, setConsultasHoje] = useState([
    {
      id: 1,
      paciente: "João Silva",
      horario: "09:00",
      status: "agendada",
      telefone: "(11) 98765-4321",
      tipo: "Consulta de rotina"
    },
    {
      id: 2,
      paciente: "Maria Oliveira",
      horario: "10:30",
      status: "agendada",
      telefone: "(11) 91234-5678",
      tipo: "Retorno"
    },
    {
      id: 3,
      paciente: "Pedro Santos",
      horario: "13:00",
      status: "agendada",
      telefone: "(11) 92345-6789",
      tipo: "Primeira consulta"
    },
    {
      id: 4,
      paciente: "Ana Sousa",
      horario: "14:30",
      status: "realizada",
      telefone: "(11) 93456-7890",
      tipo: "Exame de rotina",
      observacoes: "Paciente relatou melhora dos sintomas. Retorno em 30 dias."
    }
  ]);

  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [observacoes, setObservacoes] = useState("");

  const confirmarConsulta = (id) => {
    setConsultasHoje(consultasHoje.map(consulta =>
      consulta.id === id ? {...consulta, status: "realizada", observacoes} : consulta
    ));
    setConsultaSelecionada(null);
    setObservacoes("");
  };

  const marcarFalta = (id) => {
    setConsultasHoje(consultasHoje.map(consulta =>
      consulta.id === id ? {...consulta, status: "faltou"} : consulta
    ));
    setConsultaSelecionada(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MediConsulta</h1>
          <div className="flex items-center gap-4">
            <span>Dr. Carlos Mendes</span>
            <div className="bg-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Consultas do Dia
          </h2>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="border rounded px-3 py-2 mr-2"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Filtrar
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="border rounded pl-10 pr-3 py-2 w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Consultas */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Horário</th>
                  <th className="px-4 py-2 text-left">Paciente</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultasHoje.map((consulta) => (
                  <tr key={consulta.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      {consulta.horario}
                    </td>
                    <td className="px-4 py-3">{consulta.paciente}</td>
                    <td className="px-4 py-3">{consulta.tipo}</td>
                    <td className="px-4 py-3">
                      {consulta.status === "agendada" && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Agendada
                        </span>
                      )}
                      {consulta.status === "realizada" && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Realizada
                        </span>
                      )}
                      {consulta.status === "faltou" && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Não compareceu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {consulta.status === "agendada" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConsultaSelecionada(consulta)}
                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                            title="Confirmar realização"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => marcarFalta(consulta.id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            title="Marcar falta"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConsultaSelecionada(consulta)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                          title="Ver detalhes"
                        >
                          <FileText size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de confirmação */}
      {consultaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">
              {consultaSelecionada.status === "agendada" ? "Confirmar Realização de Consulta" : "Detalhes da Consulta"}
            </h3>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Paciente:</span>
                <span>{consultaSelecionada.paciente}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Horário:</span>
                <span>{consultaSelecionada.horario}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Telefone:</span>
                <span>{consultaSelecionada.telefone}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Tipo:</span>
                <span>{consultaSelecionada.tipo}</span>
              </div>
            </div>

            {consultaSelecionada.status === "agendada" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Observações da consulta:</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full border rounded p-2 h-32"
                  placeholder="Descreva aqui as observações, procedimentos realizados e orientações para o paciente..."
                ></textarea>
              </div>
            ) : (
              <div className="mb-4">
                <p className="font-medium mb-1">Observações da consulta:</p>
                <p className="border rounded p-2 bg-gray-50">{consultaSelecionada.observacoes || "Nenhuma observação registrada."}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => {
                  setConsultaSelecionada(null);
                  setObservacoes("");
                }}
              >
                {consultaSelecionada.status === "agendada" ? "Cancelar" : "Fechar"}
              </button>

              {consultaSelecionada.status === "agendada" && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => confirmarConsulta(consultaSelecionada.id)}
                >
                  Confirmar Realização
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```
