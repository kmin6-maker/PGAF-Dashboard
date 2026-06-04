import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Loader2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { extractKeywords } from '../utils/nlpHelper';

const SmartAssistant = ({ data, onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [fuseInstance, setFuseInstance] = useState(null);

  // Initialize Fuse when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const options = {
        includeScore: true,
        useExtendedSearch: true,
        threshold: 0.3,
        keys: [
          { name: 'name', weight: 1 },
          { name: 'location', weight: 1.5 },
          { name: 'function', weight: 2 },
          { name: 'skills', weight: 2 },
          { name: 'status', weight: 1.5 },
          { name: 'hours', weight: 1 },
          { name: 'tenure', weight: 1 }
        ]
      };
      setFuseInstance(new Fuse(data, options));
    }
  }, [data]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) {
      clearSearch();
      return;
    }

    setIsThinking(true);
    setIsActive(true);

    // Simulate AI thinking delay for UX
    setTimeout(() => {
      const keywords = extractKeywords(query);
      
      if (keywords.length === 0) {
        onSearchResults(data); // reset if no keywords
      } else {
        // Build an extended search query where EVERY keyword must be present natively or fuzzily
        // In extended search, prefixing with ' means "include"
        // Wait, ' is exact match. Let's just join them with space, which acts as OR in basic extended search,
        // but we want an AND like behavior if possible. 
        // Actually, without operators, Fuse just does fuzzy matching.
        // Let's just pass the joined keywords to let Fuse do its magic.
        const searchQuery = keywords.join(' ');
        
        const results = fuseInstance.search(searchQuery);
        // Fuse returns [{ item, score }, ...]
        // We just need the items
        const matchedItems = results.map(result => result.item);
        
        onSearchResults(matchedItems, keywords);
      }
      
      setIsThinking(false);
    }, 600); // 600ms fake delay for AI feel
  };

  const clearSearch = () => {
    setQuery('');
    setIsActive(false);
    setIsThinking(false);
    onSearchResults(null, null); // Signal to reset
  };

  return (
    <div className={`ai-assistant-container ${isActive ? 'active' : ''}`}>
      <div className="ai-assistant-header">
        <Sparkles size={18} className="sparkle-icon" />
        <h3>Smart AI Search</h3>
      </div>
      <p className="ai-description">
        Type what you are looking for in plain English. For example: <em>"Find me retired people with finance and data analysis skills available 4 hours"</em>
      </p>
      
      <form onSubmit={handleSearch} className="ai-input-wrapper">
        <input
          type="text"
          className="ai-input"
          placeholder="Ask the AI to find someone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isThinking}
        />
        
        {isActive && !isThinking && (
          <button type="button" className="ai-clear-btn" onClick={clearSearch}>
            <X size={16} />
          </button>
        )}
        
        <button type="submit" className="ai-submit-btn" disabled={isThinking || !query.trim()}>
          {isThinking ? <Loader2 size={18} className="spin-icon" /> : <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
};

export default SmartAssistant;
