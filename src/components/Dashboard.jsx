import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, TrendingUp, Target, HeartHandshake, Briefcase, 
  GraduationCap, Clock, Sun, Send, Activity, Zap, UserCheck
} from 'lucide-react';

const COLORS = ['#0056D2', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6'];

const Dashboard = ({ data }) => {
  const stats = useMemo(() => {
    let activeLeaders = 0;
    let potentialLeaders = 0;
    let snAlumni = 0;
    let directOutreach = 0;
    let founders = 0;
    let retiredExperts = 0;
    let highAvailability = 0;
    let heavyEngagement = 0;

    data.forEach(item => {
      if (item.pipeline === 'Ready Now') activeLeaders++;
      else if (item.pipeline === 'Warm Lead') potentialLeaders++;
      if (item.snAttendee === 'Yes') snAlumni++;
      if (item.justAskMe === 'Yes') directOutreach++;

      const status = (item.status || '').toLowerCase();
      if (status.includes('entrepreneur') || status.includes('consultant')) founders++;
      if (status.includes('retirement') || status.includes('retiree')) retiredExperts++;

      if ((item.hours || '').includes('10+')) highAvailability++;
      if (item.engagement === 'Heavy') heavyEngagement++;
    });

    const responseRate = ((data.length / 269) * 100).toFixed(1) + '%';

    return {
      responses: data.length,
      activeLeaders,
      potentialLeaders,
      snAlumni,
      directOutreach,
      responseRate,
      founders,
      retiredExperts,
      highAvailability,
      heavyEngagement
    };
  }, [data]);

  const chartsData = useMemo(() => {
    // Skills processing
    const skillsMap = {};
    data.forEach(item => {
      if (item.skills && typeof item.skills === 'string') {
        item.skills.split(',').forEach(skill => {
          const s = skill.trim();
          if (s) skillsMap[s] = (skillsMap[s] || 0) + 1;
        });
      }
    });
    const skillsData = Object.entries(skillsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);

    // Timeline - use clean dates
    const timelineMap = {};
    data.forEach(item => {
      if (item.dateClean) {
        timelineMap[item.dateClean] = (timelineMap[item.dateClean] || 0) + 1;
      }
    });
    
    const timelineData = Object.entries(timelineMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (timelineData.length > 0) {
      let acc = 0;
      timelineData.forEach(d => {
        acc += d.count;
        d.total = acc;
      });
    }

    // Status processing
    const statusMap = {};
    data.forEach(item => {
      const st = item.status || 'Unknown';
      let cleanStatus = st;
      if (st.includes('entrepreneur')) cleanStatus = 'Founders/Consultants';
      if (st.includes('retirement')) cleanStatus = 'Retirees';
      if (st.includes('Working full-time')) cleanStatus = 'Full-Time';
      if (st.includes('Working part-time')) cleanStatus = 'Part-Time';
      if (st.includes('Between chapters')) cleanStatus = 'In Transition';
      statusMap[cleanStatus] = (statusMap[cleanStatus] || 0) + 1;
    });
    const statusData = Object.entries(statusMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Generation processing
    const genMap = {};
    data.forEach(item => {
      const gen = item.generation || 'Unknown';
      let cleanGen = gen;
      if (gen.includes('Prefer not')) cleanGen = 'Prefer not to say';
      genMap[cleanGen] = (genMap[cleanGen] || 0) + 1;
    });
    const generationData = Object.entries(genMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Activation barriers
    const barrierMap = {};
    data.forEach(item => {
      if (item.easier && typeof item.easier === 'string' && item.easier !== '0') {
        item.easier.split(',').forEach(b => {
          let clean = b.trim();
          if (clean.includes('Clear')) clean = 'Clear, specific asks';
          else if (clean.includes('async')) clean = 'Async / flexible';
          else if (clean.includes('Short-term')) clean = 'Short-term only';
          else if (clean.includes('contribution')) clean = 'See my impact';
          else if (clean.includes('thank-you')) clean = 'Recognition';
          else if (clean.includes('Better communication')) clean = 'Better comms';
          else if (clean.includes('Just ask')) clean = 'Just ask me directly';
          else return;
          barrierMap[clean] = (barrierMap[clean] || 0) + 1;
        });
      }
    });
    const barrierData = Object.entries(barrierMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Seniority breakdown
    const seniorityMap = {};
    data.forEach(item => {
      if (item.seniority && item.seniority !== 'No data') {
        seniorityMap[item.seniority] = (seniorityMap[item.seniority] || 0) + 1;
      }
    });
    const seniorityData = Object.entries(seniorityMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const order = ['Early Career', 'Mid-Level', 'Senior', 'Executive'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

    return { skillsData, timelineData, statusData, generationData, barrierData, seniorityData };
  }, [data]);

  const KpiCard = ({ title, value, icon: Icon, gradient }) => (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-label">{title}</span>
        <div className="kpi-icon" style={{ background: gradient }}>
          <Icon size={20} color="white" />
        </div>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Overview Analytics</h2>
      
      {/* KPI Row 1 */}
      <div className="kpi-grid">
        <KpiCard title="Total Ambassadors" value={stats.responses} icon={Users} gradient="linear-gradient(135deg, #3b82f6, #2563eb)" />
        <KpiCard title="Engagement Rate" value={stats.responseRate} icon={Activity} gradient="linear-gradient(135deg, #10b981, #059669)" />
        <KpiCard title="Ready to Lead" value={stats.activeLeaders} icon={TrendingUp} gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
        <KpiCard title="Warm Leads" value={stats.potentialLeaders} icon={HeartHandshake} gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)" />
        <KpiCard title="Just Ask Me" value={stats.directOutreach} icon={Target} gradient="linear-gradient(135deg, #ef4444, #dc2626)" />
      </div>

      {/* KPI Row 2 */}
      <div className="kpi-grid">
        <KpiCard title="SN Alumni" value={stats.snAlumni} icon={GraduationCap} gradient="linear-gradient(135deg, #0ea5e9, #0284c7)" />
        <KpiCard title="Heavy Engagement" value={stats.heavyEngagement} icon={Zap} gradient="linear-gradient(135deg, #14b8a6, #0d9488)" />
        <KpiCard title="Founders / Conslt" value={stats.founders} icon={Briefcase} gradient="linear-gradient(135deg, #6366f1, #4f46e5)" />
        <KpiCard title="Retired Experts" value={stats.retiredExperts} icon={Sun} gradient="linear-gradient(135deg, #f97316, #ea580c)" />
        <KpiCard title="10+ Hrs/Month" value={stats.highAvailability} icon={Clock} gradient="linear-gradient(135deg, #ec4899, #db2777)" />
      </div>

      {/* Charts Row 1: Growth + Status */}
      <div className="chart-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Ambassador Network Growth</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartsData.timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fontSize: 11}} tickMargin={10} />
                <YAxis tick={{fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <RechartsTooltip />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Career Status Breakdown</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartsData.statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartsData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Generation + Seniority */}
      <div className="chart-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Generation Mix</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartsData.generationData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartsData.generationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Seniority Distribution</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartsData.seniorityData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 3: Skills + Barriers */}
      <div className="chart-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Top Skills Offered</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartsData.skillsData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={180} tick={{fontSize: 11}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartsData.skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>What People Need to Get Involved</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartsData.barrierData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 11}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]}>
                  {chartsData.barrierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Just ask me directly' ? '#ef4444' : COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
