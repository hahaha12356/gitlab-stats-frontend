import React, { useState } from 'react';

const ConfigForm = ({ onSubmit }) => {
  const [config, setConfig] = useState({
    gitlab_url: '',
    private_token: '',
    group_id: '',
    start_date: '',
    end_date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(config);
  };

  const handleChange = (e) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="config-form">
      <div className="form-group">
        <label>GitLab URL:</label>
        <input
          type="text"
          name="gitlab_url"
          value={config.gitlab_url}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Private Token:</label>
        <input
          type="password"
          name="private_token"
          value={config.private_token}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Group ID:</label>
        <input
          type="text"
          name="group_id"
          value={config.group_id}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Start Date:</label>
        <input
          type="date"
          name="start_date"
          value={config.start_date}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>End Date:</label>
        <input
          type="date"
          name="end_date"
          value={config.end_date}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit">Generate Stats</button>
    </form>
  );
};

export default ConfigForm; 