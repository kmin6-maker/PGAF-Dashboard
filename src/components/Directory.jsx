import React, { useState, useMemo } from 'react';
import { Search, Filter, Mail, MapPin, Briefcase, SlidersHorizontal, Sparkles } from 'lucide-react';
import SmartAssistant from './SmartAssistant';

const Directory = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Smart Search Filters
  const [filters, setFilters] = useState({
    function: '',
    generation: '',
    status: '',
    leadPGAF: '',
    skill: '',
    hours: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  
  // AI Smart Search State
  const [aiResults, setAiResults] = useState(null);
  const [aiKeywords, setAiKeywords] = useState(null);

  // Extract unique options for dropdowns
  const options = useMemo(() => {
    const fns = new Set();
    const gens = new Set();
    const statuses = new Set();
    const leads = new Set();
    const skills = new Set();
    const hours = new Set();

    data.forEach(item => {
      if (item.function) fns.add(item.function.split('(')[0].trim());
      if (item.generation) gens.add(item.generation);
      if (item.status) statuses.add(item.status);
      if (item.leadPGAF) leads.add(item.leadPGAF);
      if (item.hours) hours.add(item.hours);
      
      if (item.skills) {
        item.skills.split(',').forEach(skill => {
          skills.add(skill.trim());
        });
      }
    });

    return {
      functions: Array.from(fns).sort(),
      generations: Array.from(gens).sort(),
      statuses: Array.from(statuses).sort(),
      leads: Array.from(leads).sort(),
      skills: Array.from(skills).sort(),
      hours: Array.from(hours).sort()
    };
  }, [data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    // If AI has provided results, use them as the base dataset, otherwise use all data
    const baseData = aiResults !== null ? aiResults : data;

    return baseData.filter(item => {
      // 1. Text Search
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Smart Filters (AND logic)
      if (filters.function && !(item.function || '').includes(filters.function)) return false;
      if (filters.generation && item.generation !== filters.generation) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.leadPGAF && item.leadPGAF !== filters.leadPGAF) return false;
      if (filters.hours && item.hours !== filters.hours) return false;
      
      if (filters.skill) {
        if (!(item.skills || '').includes(filters.skill)) return false;
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="glass-panel animate-fade-in directory-container">
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Smart Search Directory</h2>
          <p>Find and connect with P&G Ambassadors ({filteredData.length} matches)</p>
        </div>
      </div>

      {/* AI Smart Search Assistant */}
      <div style={{ marginBottom: '2rem' }}>
        <SmartAssistant 
          data={data} 
          onSearchResults={(results, keywords) => {
            setAiResults(results);
            setAiKeywords(keywords);
          }} 
        />
        
        {aiKeywords && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>AI extracted keywords:</span>
            {aiKeywords.map(kw => (
              <span key={kw} className="badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Sparkles size={10} /> {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Search Bar */}
      <div className="search-bar-container" style={{ marginBottom: '1rem' }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Quick search by name, location, or email..." 
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

      {/* Expandable Smart Filters Panel */}
      {showFilters && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.6)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--panel-border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div className="input-group">
            <label className="input-label">Function</label>
            <select className="input-field" value={filters.function} onChange={(e) => handleFilterChange('function', e.target.value)}>
              <option value="">All Functions</option>
              {options.functions.map(o => o && <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          <div className="input-group">
            <label className="input-label">Generation</label>
            <select className="input-field" value={filters.generation} onChange={(e) => handleFilterChange('generation', e.target.value)}>
              <option value="">All Generations</option>
              {options.generations.map(o => o && <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Skill</label>
            <select className="input-field" value={filters.skill} onChange={(e) => handleFilterChange('skill', e.target.value)}>
              <option value="">All Skills</option>
              {options.skills.map(o => o && <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Pipeline (Lead PGAF)</label>
            <select className="input-field" value={filters.leadPGAF} onChange={(e) => handleFilterChange('leadPGAF', e.target.value)}>
              <option value="">All Pipeline</option>
              {options.leads.map(o => o && <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Hours / Month</label>
            <select className="input-field" value={filters.hours} onChange={(e) => handleFilterChange('hours', e.target.value)}>
              <option value="">All Hours</option>
              {options.hours.map(o => o && <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="input-field" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All Statuses</option>
              {options.statuses.map(o => o && <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => setFilters({function: '', generation: '', status: '', leadPGAF: '', skill: '', hours: ''})}
              >
                Clear Filters
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
              <th>Contact</th>
              <th>Location</th>
              <th>Function / Tenure</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((person, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{person.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{person.generation}</div>
                  </td>
                  <td>
                    {person.email && (
                      <a href={`mailto:${person.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        <Mail size={14} />
                        {person.email}
                      </a>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                      <MapPin size={14} color="var(--text-muted)" />
                      {person.location}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      <Briefcase size={14} color="var(--text-muted)" />
                      <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {person.function ? person.function.split('(')[0].trim() : 'Unknown'}
                      </span>
                    </div>
                    <span className="badge">{person.tenure ? person.tenure.split('(')[0].trim() : 'Unknown'}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>
                      {person.status}
                    </div>
                    {person.leadPGAF?.toLowerCase().includes('yes') && (
                      <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a', marginTop: '0.4rem' }}>
                        Ready to Lead
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No ambassadors found matching your smart search criteria.
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
