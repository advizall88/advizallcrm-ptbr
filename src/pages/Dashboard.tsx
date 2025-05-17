import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, LineChartIcon, UsersIcon, DollarSignIcon, BarChartIcon } from 'lucide-react';
import { prospectService } from '@/services/prospectService';
import { clientService } from '@/services/clientService';
import { meetingService } from '@/services/meetingService';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { useTheme } from '@/contexts/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProspects: 0,
    totalClients: 0,
    newProspectsThisMonth: 0,
    newClientsThisMonth: 0,
    upcomingMeetings: 0,
    totalRevenue: 0,
    totalProjects: 0
  });
  const [prospects, setProspects] = useState([]);
  const [clients, setClients] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [prospectsByStage, setProspectsByStage] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [conversionRateData, setConversionRateData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch prospects
        const allProspects = await prospectService.getProspects();
        setProspects(allProspects);
        
        // Fetch clients
        const allClients = await clientService.getClients();
        setClients(allClients);
        
        // Fetch upcoming meetings
        const upcomingMeetings = await meetingService.getUpcomingMeetings();
        setMeetings(upcomingMeetings);
        
        // Calculate metrics
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        const newProspectsThisMonth = allProspects.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
        });
        
        const newClientsThisMonth = allClients.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
        });
        
        // Calculate total projects
        let totalProjects = 0;
        for (const client of allClients) {
          const projects = await clientService.getProjects(client.id);
          totalProjects += projects.length;
        }
        
        // Calculate total revenue
        let totalRevenue = 0;
        for (const client of allClients) {
          totalRevenue += client.monthly_fee || 0;
        }
        
        setMetrics({
          totalProspects: allProspects.length,
          totalClients: allClients.length,
          newProspectsThisMonth: newProspectsThisMonth.length,
          newClientsThisMonth: newClientsThisMonth.length,
          upcomingMeetings: upcomingMeetings.length,
          totalRevenue,
          totalProjects
        });
        
        // Prepare data for charts
        const stageCount = {
          new: 0,
          interested: 0,
          negotiation: 0,
          lost: 0
        };
        
        allProspects.forEach(prospect => {
          const status = prospect.status;
          if (status && status in stageCount) {
            stageCount[status]++;
          }
        });
        
        const chartData = Object.entries(stageCount).map(([id, value]) => ({
          id,
          label: id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value
        }));
        
        setProspectsByStage(chartData);
        
        // Mock revenue data for the last 12 months
        const mockRevenueData = [];
        const mockConversionData = [];
        
        for (let i = 0; i < 12; i++) {
          const month = new Date();
          month.setMonth(month.getMonth() - i);
          const monthName = month.toLocaleString('default', { month: 'short' });
          const year = month.getFullYear();
          
          mockRevenueData.unshift({
            x: `${monthName} ${year}`,
            y: Math.floor(Math.random() * 10000) + 5000
          });
          
          mockConversionData.unshift({
            x: `${monthName} ${year}`,
            y: Math.floor(Math.random() * 30) + 10
          });
        }
        
        setRevenueData([
          {
            id: 'revenue',
            data: mockRevenueData
          }
        ]);
        
        setConversionRateData([
          {
            id: 'conversion',
            data: mockConversionData
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Define chart theme based on dark mode
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: darkMode ? '#CBD5E1' : '#64748B'
        }
      },
      legend: {
        text: {
          fill: darkMode ? '#E2E8F0' : '#334155'
        }
      }
    },
    grid: {
      line: {
        stroke: darkMode ? '#334155' : '#E2E8F0'
      }
    },
    legends: {
      text: {
        fill: darkMode ? '#CBD5E1' : '#64748B'
      }
    },
    labels: {
      text: {
        fill: darkMode ? '#F8FAFC' : '#0F172A'
      }
    },
    tooltip: {
      container: {
        background: darkMode ? '#1E293B' : '#FFFFFF',
        color: darkMode ? '#F8FAFC' : '#0F172A',
      }
    }
  };
  
  const recentProspects = prospects.slice(0, 5);
  const recentClients = clients.slice(0, 5);
  const upcomingMeetings = meetings.slice(0, 5);
  
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Painel</h1>
          <div className="flex gap-2">
            <Button variant="outline">Exportar Relatório</Button>
            <Button>Atualizar Dados</Button>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Prospectos</p>
                  <p className="text-3xl font-bold">{metrics.totalProspects}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{metrics.newProspectsThisMonth} este mês
                  </p>
                </div>
                <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                  <UsersIcon className="h-8 w-8 text-primary dark:text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                  <p className="text-3xl font-bold">{metrics.totalClients}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +{metrics.newClientsThisMonth} este mês
                  </p>
                </div>
                <div className="bg-green-500/10 dark:bg-green-500/20 p-2 rounded-full">
                  <UsersIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Próximas Reuniões</p>
                  <p className="text-3xl font-bold">{metrics.upcomingMeetings}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Próximos 7 dias
                  </p>
                </div>
                <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-full">
                  <CalendarIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                  <p className="text-3xl font-bold">R${metrics.totalRevenue.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.totalProjects} projetos ativos
                  </p>
                </div>
                <div className="bg-amber-500/10 dark:bg-amber-500/20 p-2 rounded-full">
                  <DollarSignIcon className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <Tabs defaultValue="overview">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="sales">Pipeline de Vendas</TabsTrigger>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prospectos por Etapa</CardTitle>
                  <CardDescription>Distribuição dos prospectos nas etapas do funil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveBar
                      data={prospectsByStage}
                      keys={['value']}
                      indexBy="id"
                      margin={{ top: 10, right: 20, bottom: 50, left: 40 }}
                      padding={0.3}
                      valueScale={{ type: 'linear' }}
                      colors={darkMode ? { scheme: 'pastel1' } : { scheme: 'nivo' }}
                      borderRadius={4}
                      theme={chartTheme}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Etapa',
                        legendPosition: 'middle',
                        legendOffset: 40
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Quantidade',
                        legendPosition: 'middle',
                        legendOffset: -35
                      }}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      labelTextColor={darkMode ? { from: 'color', modifiers: [['darker', 3]] } : { from: 'color', modifiers: [['darker', 1.6]] }}
                      role="application"
                      ariaLabel="Prospects by Stage"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conversão</CardTitle>
                  <CardDescription>Conversão de prospecto para cliente ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveLine
                      data={conversionRateData}
                      margin={{ top: 10, right: 20, bottom: 50, left: 40 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 0, max: 'auto' }}
                      curve="monotoneX"
                      axisTop={null}
                      axisRight={null}
                      theme={chartTheme}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Mês',
                        legendOffset: 40,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Taxa (%)',
                        legendOffset: -40,
                        legendPosition: 'middle'
                      }}
                      colors={darkMode ? ['#60A5FA'] : { scheme: 'category10' }}
                      pointSize={10}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      enableArea={true}
                      areaOpacity={0.15}
                      useMesh={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline de Vendas</CardTitle>
                  <CardDescription>Distribuição atual dos valores por etapa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsivePie
                      data={prospectsByStage}
                      margin={{ top: 10, right: 20, bottom: 50, left: 20 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      borderWidth={1}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor={darkMode ? "#E2E8F0" : { from: 'color', modifiers: [['darker', 2]] }}
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor={darkMode ? { from: 'color', modifiers: [['darker', 3]] } : { from: 'color', modifiers: [['darker', 2]] }}
                      colors={darkMode ? { scheme: 'pastel1' } : { scheme: 'category10' }}
                      theme={chartTheme}
                      legends={[
                        {
                          anchor: 'bottom',
                          direction: 'row',
                          justify: false,
                          translateX: 0,
                          translateY: 45,
                          itemsSpacing: 0,
                          itemWidth: 80,
                          itemHeight: 18,
                          itemTextColor: darkMode ? '#CBD5E1' : '#999',
                          itemDirection: 'left-to-right',
                          itemOpacity: 1,
                          symbolSize: 18,
                          symbolShape: 'circle'
                        }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Sucesso por Tipo de Negócio</CardTitle>
                  <CardDescription>Taxa de conversão por tipo de negócio do cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveBar
                      data={[
                        { businessType: 'Restaurant', rate: 68 },
                        { businessType: 'Retail', rate: 72 },
                        { businessType: 'Professional', rate: 84 },
                        { businessType: 'Healthcare', rate: 62 },
                        { businessType: 'Service', rate: 75 }
                      ]}
                      keys={['rate']}
                      indexBy="businessType"
                      margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
                      padding={0.3}
                      layout="horizontal"
                      valueScale={{ type: 'linear' }}
                      colors={darkMode ? { scheme: 'pastel1' } : { scheme: 'paired' }}
                      borderRadius={4}
                      theme={chartTheme}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Taxa de Sucesso (%)',
                        legendPosition: 'middle',
                        legendOffset: 35
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Tipo de Negócio',
                        legendPosition: 'middle',
                        legendOffset: -50
                      }}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      labelTextColor={darkMode ? { from: 'color', modifiers: [['darker', 3]] } : { from: 'color', modifiers: [['darker', 1.6]] }}
                      role="application"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Crescimento da receita nos últimos 12 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveLine
                      data={revenueData}
                      margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                      curve="monotoneX"
                      axisTop={null}
                      axisRight={null}
                      theme={chartTheme}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Mês',
                        legendOffset: 40,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Receita (R$)',
                        legendOffset: -50,
                        legendPosition: 'middle',
                        format: value => `R$${value.toLocaleString()}`
                      }}
                      enableGridX={false}
                      colors={darkMode ? ['#10B981'] : { scheme: 'category10' }}
                      lineWidth={3}
                      pointSize={10}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      enableArea={true}
                      areaOpacity={0.15}
                      useMesh={true}
                      legends={[
                        {
                          anchor: 'top-right',
                          direction: 'column',
                          justify: false,
                          translateX: 0,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: 'left-to-right',
                          itemWidth: 80,
                          itemHeight: 20,
                          itemOpacity: 0.75,
                          symbolSize: 12,
                          symbolShape: 'circle',
                          symbolBorderColor: darkMode ? 'rgba(255, 255, 255, .3)' : 'rgba(0, 0, 0, .5)',
                          effects: [
                            {
                              on: 'hover',
                              style: {
                                itemBackground: darkMode ? 'rgba(255, 255, 255, .1)' : 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                              }
                            }
                          ]
                        }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Prospectos Recentes</CardTitle>
              <CardDescription>Últimos prospectos adicionados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProspects.map(prospect => (
                  <div key={prospect.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{prospect.contact_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{prospect.contact_name}</p>
                      <p className="text-xs text-muted-foreground">{prospect.company_name || 'Individual'}</p>
                    </div>
                    <Badge className="capitalize">{prospect.status.replace('_', ' ')}</Badge>
                  </div>
                ))}
                {recentProspects.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum prospecto recente</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Últimas conversões de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map(client => (
                  <div key={client.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{client.contact_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{client.contact_name}</p>
                      <p className="text-xs text-muted-foreground">{client.company_name || 'Individual'}</p>
                    </div>
                    <Badge className="capitalize" variant={client.status === 'active' ? 'default' : 'destructive'}>
                      {client.status}
                    </Badge>
                  </div>
                ))}
                {recentClients.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum cliente recente</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Próximas Reuniões</CardTitle>
              <CardDescription>Suas reuniões agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map(meeting => (
                  <div key={meeting.id} className="flex items-center space-x-4">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-primary dark:text-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(meeting.start_time).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {meeting.meet_link && (
                      <Button variant="outline" size="sm" className="h-8">
                        Entrar
                      </Button>
                    )}
                  </div>
                ))}
                {upcomingMeetings.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma reunião agendada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
