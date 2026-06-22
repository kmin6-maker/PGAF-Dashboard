import React, { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal, Users, Zap, GraduationCap } from 'lucide-react';
import MultiSelect from './MultiSelect';

const Directory = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    function: [],
    generation: [],
    status: [],
    leadPGAF: [],
    skill: [],
    hours: [],
    seniority: [],
    engagement: [],
    snAttendee: [],
    justAskMe: []
  });

  const [showFilters, setShowFilters] = useState(false);

  const options = useMemo(() => {
    const fns = new Set();
    const gens = new Set();
    const statuses = new Set();
    const leads = new Set();
    const skills = new Set();
    const hours = new Set();
    const seniorities = new Set();
    const engagements = new Set();

    data.forEach(item => {
      if (item.function) fns.add(item.function.split('(')[0].trim());
      if (item.generation) gens.add(item.generation);
      if (item.status) statuses.add(item.status);
      if (item.leadPGAF && item.leadPGAF !== '0') leads.add(item.leadPGAF);
      if (item.hours && item.hours !== '0') hours.add(item.hours);
      if (item.seniority && item.seniority !== 'No data') seniorities.add(item.seniority);
      if (item.engagement && item.engagement !== 'No data') engagements.add(item.engagement);
      
      if (item.skills && typeof item.skills === 'string') {
        item.skills.split(',').forEach(skill => {
          const s = skill.trim();
          if (s) skills.add(s);
        });
      }
    });

    return {
      functions: Array.from(fns).sort(),
      generations: Array.from(gens).sort(),
      statuses: Array.from(statuses).sort(),
      leads: Array.from(leads).sort(),
      skills: Array.from(skills).sort(),
      hours: Array.from(hours).sort(),
      seniorities: ['Early Career', 'Mid-Level', 'Senior', 'Executive'].filter(s => seniorities.has(s)),
      engagements: ['Light', 'Medium', 'Heavy'].filter(e => engagements.has(e)),
      snOptions: ['Yes', 'No'],
      askOptions: ['Yes']
    };
  }, [data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.function || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.skills || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filters.function.length > 0 && !filters.function.some(f => (item.function || '').includes(f))) return false;
      if (filters.generation.length > 0 && !filters.generation.includes(item.generation)) return false;
      if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
      if (filters.leadPGAF.length > 0 && !filters.leadPGAF.includes(item.leadPGAF)) return false;
      if (filters.hours.length > 0 && !filters.hours.includes(item.hours)) return false;
      if (filters.skill.length > 0 && !filters.skill.some(s => (item.skills || '').includes(s))) return false;
      if (filters.seniority.length > 0 && !filters.seniority.includes(item.seniority)) return false;
      if (filters.engagement.length > 0 && !filters.engagement.includes(item.engagement)) return false;
      if (filters.snAttendee.length > 0 && !filters.snAttendee.includes(item.snAttendee)) return false;
      if (filters.justAskMe.length > 0 && !filters.justAskMe.includes(item.justAskMe)) return false;

      return true;
    });
  }, [data, searchTerm, filters]);

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  const PipelineBadge = ({ value }) => {
    if (!value || value === 'No data') return null;
    const colors = {
      'Ready Now': { bg: '#dcfce7', color: '#16a34a' },
      'Warm Lead': { bg: '#fef9c3', color: '#ca8a04' },
      'Not Now': { bg: '#fee2e2', color: '#dc2626' }
    };
    const c = colors[value] || { bg: '#f3f4f6', color: '#6b7280' };
    return <span className="badge" style={{ backgroundColor: c.bg, color: c.color }}>{value}</span>;
  };

  const SmallBadge = ({ text, bg, color }) => (
    <span className="badge" style={{ backgroundColor: bg, color: color, fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{text}</span>
  );

  return (
    <div className="glass-panel animate-fade-in directory-container">
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Smart Search Directory</h2>
          <p>Find and connect with P&G Ambassadors ({filteredData.length} matches)</p>
        </div>
      </div>

      <div className="search-bar-container" style={{ marginBottom: '1rem' }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search by name, location, function, or skill..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`btn ${showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {showFilters && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.6)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--panel-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          <div className="input-group">
            <label className="input-label">Function</label>
            <MultiSelect options={options.functions} selectedValues={filters.function} onChange={(val) => handleFilterChange('function', val)} placeholder="All Functions" />
          </div>
          <div className="input-group">
            <label className="input-label">Generation</label>
            <MultiSelect options={options.generations} selectedValues={filters.generation} onChange={(val) => handleFilterChange('generation', val)} placeholder="All Generations" />
          </div>
          <div className="input-group">
            <label className="input-label">Skill</label>
            <MultiSelect options={options.skills} selectedValues={filters.skill} onChange={(val) => handleFilterChange('skill', val)} placeholder="All Skills" />
          </div>
          <div className="input-group">
            <label className="input-label">Pipeline</label>
            <MultiSelect options={options.leads} selectedValues={filters.leadPGAF} onChange={(val) => handleFilterChange('leadPGAF', val)} placeholder="All Pipeline" />
          </div>
          <div className="input-group">
            <label className="input-label">Hours / Month</label>
            <MultiSelect options={options.hours} selectedValues={filters.hours} onChange={(val) => handleFilterChange('hours', val)} placeholder="All Hours" />
          </div>
          <div className="input-group">
            <label className="input-label">Status</label>
            <MultiSelect options={options.statuses} selectedValues={filters.status} onChange={(val) => handleFilterChange('status', val)} placeholder="All Statuses" />
          </div>
          <div className="input-group">
            <label className="input-label">Seniority</label>
            <MultiSelect options={options.seniorities} selectedValues={filters.seniority} onChange={(val) => handleFilterChange('seniority', val)} placeholder="All Seniority" />
          </div>
          <div className="input-group">
            <label className="input-label">Engagement</label>
            <MultiSelect options={options.engagements} selectedValues={filters.engagement} onChange={(val) => handleFilterChange('engagement', val)} placeholder="All Levels" />
          </div>
          <div className="input-group">
            <label className="input-label">SN Alumni</label>
            <MultiSelect options={options.snOptions} selectedValues={filters.snAttendee} onChange={(val) => handleFilterChange('snAttendee', val)} placeholder="All" />
          </div>
          <div className="input-group">
            <label className="input-label">Just Ask Me</label>
            <MultiSelect options={options.askOptions} selectedValues={filters.justAskMe} onChange={(val) => handleFilterChange('justAskMe', val)} placeholder="All" />
          </div>
          
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => setFilters({function:[], generation:[], status:[], leadPGAF:[], skill:[], hours:[], seniority:[], engagement:[], snAttendee:[], justAskMe:[]})}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Function / Seniority</th>
              <th>Skills</th>
              <th>Availability</th>
              <th>Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((person, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{person.name}</div>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                      <SmallBadge text={person.generation || '—'} bg="#f3e8ff" color="#7c3aed" />
                      {person.snAttendee === 'Yes' && <SmallBadge text="SN" bg="#dbeafe" color="#2563eb" />}
                      {person.justAskMe === 'Yes' && <SmallBadge text="Ask Me!" bg="#fee2e2" color="#dc2626" />}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                      <MapPin size={14} color="var(--text-muted)" />
                      {person.location || '—'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <Briefcase size={14} color="var(--text-muted)" />
                      <span style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {person.function ? person.function.split('(')[0].trim() : '—'}
                      </span>
                    </div>
                    {person.seniority && person.seniority !== 'No data' && (
                      <SmallBadge text={person.seniority} bg="#f0fdf4" color="#16a34a" />
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', maxWidth: '200px' }}>
                      {person.skills ? person.skills.split(',').slice(0, 3).map((s, i) => (
                        <SmallBadge key={i} text={s.trim().replace(/ \/.*/,'')} bg="#fff7ed" color="#ea580c" />
                      )) : '—'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      {person.hours && person.hours !== 'No data' ? (
                        <>
                          <div>{person.hours.split('-')[0].split('(')[0].trim()}</div>
                          {person.engagement && person.engagement !== 'No data' && (
                            <SmallBadge 
                              text={person.engagement} 
                              bg={person.engagement === 'Heavy' ? '#dcfce7' : person.engagement === 'Medium' ? '#fef9c3' : '#f3f4f6'}
                              color={person.engagement === 'Heavy' ? '#16a34a' : person.engagement === 'Medium' ? '#ca8a04' : '#6b7280'}
                            />
                          )}
                        </>
                      ) : '—'}
                    </div>
                  </td>
                  <td>
                    <PipelineBadge value={person.pipeline} />
                    {person.volunteering && !['0', 'No data'].includes(person.volunteering) && (
                      <div style={{ marginTop: '0.3rem' }}>
                        <SmallBadge text="Volunteers" bg="#dbeafe" color="#2563eb" />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No ambassadors found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Directory;
