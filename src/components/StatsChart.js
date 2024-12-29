import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsChart = ({ data }) => {
  if (!data) return null;

  const projectData = {
    labels: data.projects.map(p => p.name),
    datasets: [
      {
        label: 'Commits',
        data: data.projects.map(p => p.commits),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Merge Requests',
        data: data.projects.map(p => p.merge_requests),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  const contributorData = {
    labels: Object.keys(data.contributors),
    datasets: [
      {
        label: 'Commits',
        data: Object.values(data.contributors).map(c => c.commits),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  return (
    <div className="stats-charts">
      <div className="chart">
        <h3>Project Statistics</h3>
        <Bar data={projectData} />
      </div>
      
      <div className="chart">
        <h3>Contributor Statistics</h3>
        <Bar data={contributorData} />
      </div>
      
      <div className="summary">
        <h3>Summary</h3>
        <p>Total Projects: {data.total_projects}</p>
        <p>Total Commits: {data.total_commits}</p>
        <p>Total Merge Requests: {data.total_merge_requests}</p>
      </div>
    </div>
  );
};

export default StatsChart; 