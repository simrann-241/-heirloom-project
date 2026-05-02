/**
 * Bob Platform Service
 * Handles fetching and processing Bobalytics data from the Bob Platform backend
 */

// Mock data simulating the Python script response
// In production, this would be replaced with actual API calls
const MOCK_BOBALYTICS_DATA = {
  status: "success",
  data: {
    bob_factor: 0.87,
    coins_spent: 245,
    lines_of_code: 1523,
    session_duration_minutes: 360,
    tasks_completed: 8
  }
};

/**
 * Fetches live Bobalytics data from the Bob Platform
 * @returns {Promise<Object>} Bobalytics data
 */
export const fetchBobalyticsData = async () => {
  try {
    // TODO: In production, replace this with actual API call to Python backend
    // Example: const response = await fetch('/api/bobalytics');
    // For now, simulate network delay with mock data
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate occasional errors for testing error states
    if (Math.random() < 0.05) {
      throw new Error('Failed to fetch Bobalytics data');
    }
    
    return MOCK_BOBALYTICS_DATA;
  } catch (error) {
    console.error('Error fetching Bobalytics:', error);
    throw error;
  }
};

/**
 * Formats the Bob Factor as a percentage
 * @param {number} bobFactor - Bob Factor value (0.0-1.0)
 * @returns {string} Formatted percentage
 */
export const formatBobFactor = (bobFactor) => {
  return `${(bobFactor * 100).toFixed(0)}%`;
};

/**
 * Formats large numbers with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Formats session duration into human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
};

/**
 * Gets the status color based on Bob Factor
 * @param {number} bobFactor - Bob Factor value (0.0-1.0)
 * @returns {string} Status indicator (excellent, good, fair, poor)
 */
export const getBobFactorStatus = (bobFactor) => {
  if (bobFactor >= 0.8) return 'excellent';
  if (bobFactor >= 0.6) return 'good';
  if (bobFactor >= 0.4) return 'fair';
  return 'poor';
};

/**
 * Production API integration example:
 * 
 * export const fetchBobalyticsData = async () => {
 *   try {
 *     const response = await fetch('http://localhost:5000/api/bobalytics', {
 *       method: 'GET',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *     });
 *     
 *     if (!response.ok) {
 *       throw new Error(`HTTP error! status: ${response.status}`);
 *     }
 *     
 *     const data = await response.json();
 *     return data;
 *   } catch (error) {
 *     console.error('Error fetching Bobalytics:', error);
 *     throw error;
 *   }
 * };
 */

// Made with Bob
