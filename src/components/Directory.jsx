import React, { useState, useMemo } from 'react';
import { Search, Filter, Mail, MapPin, Briefcase, SlidersHorizontal } from 'lucide-react';
import MultiSelect from './MultiSelect';

const Directory = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Smart Search Filters (Arrays for Multi-Select)
  const [filters, setFilters] = useState({
    function: [],
    generation: [],
    status: [],
    leadPGAF: [],
    skill: [],
    hours: []
  });

  const [showFilters, setShowFilters] = useState(false);

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
    return data.filter(item => {
      // 1. Text Search
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Smart Filters (AND across categories, OR within category)
      if (filters.function.length > 0 && !filters.function.some(f => (item.function || '').includes(f))) return false;
      if (filters.generation.length > 0 && !filters.generation.includes(item.generation)) return false;
      if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
      if (filters.leadPGAF.length > 0 && !filters.leadPGAF.includes(item.leadPGAF)) return false;
      if (filters.hours.length > 0 && !filters.hours.includes(item.hours)) return false;
      
      if (filters.skill.length > 0) {
        if (!filters.skill.some(s => (item.skills || '').includes(s))) return false;
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="glass-panel animate-fade-in directory-container">
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Smart Search Directory</h2>
          <p>Find and connect with P&G Ambassadors ({filteredData.length} matches)</p>
        </div>
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
            <MultiSelect 
              options={options.functions} 
              selectedValues={filters.function} 
              onChange={(val) => handleFilterChange('function', val)} 
              placeholder="All Functions" 
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Generation</label>
            <MultiSelect 
              options={options.generations} 
              selectedValues={filters.generation} 
              onChange={(val) => handleFilterChange('generation', val)} 
              placeholder="All Generations" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Skill</label>
            <MultiSelect 
              options={options.skills} 
              selectedValues={filters.skill} 
              onChange={(val) => handleFilterChange('skill', val)} 
              placeholder="All Skills" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Pipeline (Lead PGAF)</label>
            <MultiSelect 
              options={options.leads} 
              selectedValues={filters.leadPGAF} 
              onChange={(val) => handleFilterChange('leadPGAF', val)} 
              placeholder="All Pipeline" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Hours / Month</label>
            <MultiSelect 
              options={options.hours} 
              selectedValues={filters.hours} 
              onChange={(val) => handleFilterChange('hours', val)} 
              placeholder="All Hours" 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <MultiSelect 
              options={options.statuses} 
              selectedValues={filters.status} 
              onChange={(val) => handleFilterChange('status', val)} 
              placeholder="All Statuses" 
            />
          </div>
          
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => setFilters({function: [], generation: [], status: [], leadPGAF: [], skill: [], hours: []})}
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
