const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchStats = async (config) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}; 