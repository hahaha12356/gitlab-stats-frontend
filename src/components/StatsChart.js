import React, { useEffect, useState } from 'react';
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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data) return null;

  // 对项目进行排序：有数据的排在前面，按commits+merge_requests总数降序
  const sortedProjects = [...data.projects].sort((a, b) => {
    const aTotal = a.commits + a.merge_requests;
    const bTotal = b.commits + b.merge_requests;
    if (aTotal === 0 && bTotal === 0) return 0;
    if (aTotal === 0) return 1;
    if (bTotal === 0) return -1;
    return bTotal - aTotal;
  });

  const projectData = {
    labels: sortedProjects.map(p => p.name),
    datasets: [
      {
        label: 'Commits',
        data: sortedProjects.map(p => p.commits),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Merge Requests',
        data: sortedProjects.map(p => p.merge_requests),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  // 对贡献者数据进行排序：按总贡献（commits + merge_requests）降序
  const sortedContributors = Object.entries(data.contributors)
    .sort(([, a], [, b]) => (b.commits + b.merge_requests) - (a.commits + a.merge_requests))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  const contributorData = {
    labels: Object.keys(sortedContributors),
    datasets: [
      {
        label: 'Commits',
        data: Object.values(sortedContributors).map(c => c.commits),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Merge Requests',
        data: Object.values(sortedContributors).map(c => c.merge_requests),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      }
    ]
  };

  // 计算每个项目名称的最大长度
  const maxProjectNameLength = Math.max(...sortedProjects.map(p => p.name.length));
  // 计算每个贡献者名称的最大长度
  const maxContributorNameLength = Math.max(...Object.keys(sortedContributors).map(name => name.length));

  // 项目统计图表配置
  const projectOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: Math.max(8, Math.min(12, screenWidth / 100)) // 根据屏幕宽度动态调整字体大小
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  // 贡献者统计图表配置
  const contributorOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // 使用水平条形图
    scales: {
      y: {
        ticks: {
          autoSkip: false,
          font: {
            size: Math.max(10, Math.min(14, screenWidth / 100))
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.x || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  // 计算图表容器宽度
  const chartWidth = Math.max(screenWidth - 100, 1200); // 考虑页面边距
  const projectChartHeight = Math.max(500, data.projects.length * 15); // 根据项目数量调整高度
  const contributorChartHeight = Math.max(400, Object.keys(sortedContributors).length * 30); // 根据贡献者数量调整高度

  return (
    <div className="stats-charts">
      <div className="chart" style={{ height: `${projectChartHeight}px`, width: '100%' }}>
        <h3>Project Statistics</h3>
        <div style={{ width: '100%', height: '100%' }}>
          <Bar data={projectData} options={projectOptions} />
        </div>
      </div>
      
      <div className="chart" style={{ height: `${contributorChartHeight}px` }}>
        <h3>Contributor Statistics</h3>
        <Bar data={contributorData} options={contributorOptions} />
      </div>
      
      <div className="summary">
        <h3>Summary</h3>
        <p>Total Projects: {data.total_projects}</p>
        <p>Processed Projects: {data.processed_projects}</p>
        <p>Skipped Projects: {data.skipped_projects.length}</p>
        <p>Partial Data Projects: {data.partial_data_projects.length}</p>
        <p>Total Commits: {data.total_commits}</p>
        <p>Total Merge Requests: {data.total_merge_requests}</p>
      </div>
    </div>
  );
};

export default StatsChart; 