import React, { useState } from 'react';
import ConfigForm from './components/ConfigForm';
import StatsChart from './components/StatsChart';
import { fetchStats } from './services/api';
import './App.css';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (config) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStats(config);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>GitLab Statistics</h1>
      <ConfigForm onSubmit={handleSubmit} />
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {stats && <StatsChart data={stats} />}
    </div>
  );
}

export default App; 