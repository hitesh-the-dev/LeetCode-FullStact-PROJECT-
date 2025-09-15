import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import AlgoArenaLogo from '../components/AlgoArenaLogo';
import '../global.css';

function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch solved problems
        const { data: solvedData } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(solvedData);

        // Fetch user submissions for heatmap
        const { data: submissionsData } = await axiosClient.get('/problem/userSubmissions');
        setSubmissions(submissionsData);

        // Generate heatmap data based on real submissions
        const heatmap = generateHeatmapFromSubmissions(submissionsData);
        setHeatmapData(heatmap);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const generateHeatmapFromSubmissions = (submissions) => {
    const data = [];
    const today = new Date();

    // Create a map of submission counts by date
    const submissionCounts = {};
    submissions.forEach(submission => {
      const date = new Date(submission.createdAt).toISOString().split('T')[0];
      submissionCounts[date] = (submissionCounts[date] || 0) + 1;
    });

    // Generate 365 days of data (exactly like LeetCode)
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = submissionCounts[dateStr] || 0;

      data.push({
        date: dateStr,
        count: count,
        level: count === 0 ? 0 : 1 // Only 0 (no activity) or 1 (has activity) - binary like LeetCode
      });
    }

    return data;
  };

  const getHeatmapColor = (level) => {
    const colors = [
      'bg-[#2d2d2d]', // No activity
      'bg-[#0e4429]', // Low activity
      'bg-[#006d32]', // Medium activity
      'bg-[#26a641]', // High activity
      'bg-[#39d353]'  // Very high activity
    ];
    return colors[level] || colors[0];
  };

  const getMonthLabels = () => {
    const months = [];
    const today = new Date();

    // Generate 12 months starting from 12 months ago
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }

    return months;
  };

  const getTotalSubmissions = () => {
    return submissions.length;
  };

  const getActiveDays = () => {
    const uniqueDays = new Set();
    submissions.forEach(submission => {
      const date = new Date(submission.createdAt).toISOString().split('T')[0];
      uniqueDays.add(date);
    });
    return uniqueDays.size;
  };

  const getMaxStreak = () => {
    if (submissions.length === 0) return 0;

    const submissionDates = submissions
      .map(s => new Date(s.createdAt).toISOString().split('T')[0])
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index); // Remove duplicates

    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < submissionDates.length; i++) {
      const prevDate = new Date(submissionDates[i - 1]);
      const currDate = new Date(submissionDates[i]);
      const diffTime = currDate - prevDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(maxStreak, currentStreak);
  };

  const getDifficultyStats = () => {
    const easySolved = solvedProblems.filter(p => {
      if (typeof p.difficulty === 'string') return p.difficulty.toLowerCase() === 'easy';
      if (Array.isArray(p.difficulty)) return p.difficulty.some(d => d.toLowerCase() === 'easy');
      return false;
    }).length;

    const mediumSolved = solvedProblems.filter(p => {
      if (typeof p.difficulty === 'string') return p.difficulty.toLowerCase() === 'medium';
      if (Array.isArray(p.difficulty)) return p.difficulty.some(d => d.toLowerCase() === 'medium');
      return false;
    }).length;

    const hardSolved = solvedProblems.filter(p => {
      if (typeof p.difficulty === 'string') return p.difficulty.toLowerCase() === 'hard';
      if (Array.isArray(p.difficulty)) return p.difficulty.some(d => d.toLowerCase() === 'hard');
      return false;
    }).length;

    return { easySolved, mediumSolved, hardSolved };
  };

  const getAcceptanceRate = () => {
    if (submissions.length === 0) return 0;
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
    return ((acceptedSubmissions / submissions.length) * 100).toFixed(1);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <NavLink to="/" className="btn btn-primary">Go Home</NavLink>
        </div>
      </div>
    );
  }

  const totalSubmissions = getTotalSubmissions();
  const activeDays = getActiveDays();
  const maxStreak = getMaxStreak();
  const difficultyStats = getDifficultyStats();
  const acceptanceRate = getAcceptanceRate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Clean Navigation Bar */}
      <nav className="bg-[#262626] border-b border-[#3e3e3e] px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <AlgoArenaLogo />
            <div className="flex space-x-6">
              <NavLink to="/" className="text-gray-300 hover:text-white">Explore</NavLink>
              <NavLink to="/problems" className="text-gray-300 hover:text-white">Problems</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm text-purple-400">👤</span>
              </div>
              <span className="text-white text-sm">{user.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-4 py-1 rounded text-sm hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Questions Completed Section */}
          <div className="bg-[#262626] rounded-lg p-6">
            <div className="flex items-center justify-between">
              {/* Circular Progress Chart */}
              <div className="flex items-center">
                <div className="relative w-32 h-32 mr-8">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" stroke="#374151" strokeWidth="8" fill="none"/>
                    {/* Progress segments */}
                    <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="8" fill="none"
                            strokeDasharray={`${(difficultyStats.easySolved / 899) * 283} 283`}
                            strokeDashoffset="0"/>
                    <circle cx="50" cy="50" r="45" stroke="#f59e0b" strokeWidth="8" fill="none"
                            strokeDasharray={`${(difficultyStats.mediumSolved / 1918) * 283} 283`}
                            strokeDashoffset={`-${(difficultyStats.easySolved / 899) * 283}`}/>
                    <circle cx="50" cy="50" r="45" stroke="#ef4444" strokeWidth="8" fill="none"
                            strokeDasharray={`${(difficultyStats.hardSolved / 869) * 283} 283`}
                            strokeDashoffset={`-${((difficultyStats.easySolved / 899) + (difficultyStats.mediumSolved / 1918)) * 283}`}/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-gray-300">{acceptanceRate}%</div>
                    <div className="text-sm text-gray-400">Acceptance</div>
                    <div className="text-xs text-gray-500 mt-1">{totalSubmissions} submission{totalSubmissions !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>

              {/* Difficulty Stats Cards */}
              <div className="flex-1 space-y-3">
                <div className="bg-[#1a1a1a] rounded-lg p-4 flex justify-between items-center">
                  <span className="text-cyan-400 font-medium">Easy</span>
                  <span className="text-white font-semibold">{difficultyStats.easySolved}</span>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4 flex justify-between items-center">
                  <span className="text-yellow-400 font-medium">Med.</span>
                  <span className="text-white font-semibold">{difficultyStats.mediumSolved}</span>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4 flex justify-between items-center">
                  <span className="text-red-400 font-medium">Hard</span>
                  <span className="text-white font-semibold">{difficultyStats.hardSolved}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission History Heatmap */}
          <div className="bg-[#262626] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Total {difficultyStats.easySolved + difficultyStats.mediumSolved + difficultyStats.hardSolved} submissions in the past one year
              </h3>
              <select className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600">
                <option>Current</option>
              </select>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Total active days: {activeDays} • Max streak: {maxStreak}
            </div>

            {/* Heatmap Grid - Exact LeetCode Style */}
            <div className="heatmap-grid">
              {heatmapData.map((day, index) => (
                <div
                  key={index}
                  className={`heatmap-square ${day.count > 0 ? 'has-activity' : 'no-activity'}`}
                  title={`${day.date}: ${day.count} submissions`}
                />
              ))}
            </div>

            {/* Month Labels - LeetCode Style */}
            <div className="heatmap-month-labels">
              {getMonthLabels().map((month, index) => (
                <span key={index} style={{ width: '48px', textAlign: 'center' }}>
                  {month}
                </span>
              ))}
            </div>

            {/* Legend - LeetCode Style */}
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="heatmap-legend-squares">
                <div className="heatmap-legend-square" style={{ backgroundColor: '#2d2d2d' }} />
                <div className="heatmap-legend-square" style={{ backgroundColor: '#0e4429' }} />
                <div className="heatmap-legend-square" style={{ backgroundColor: '#006d32' }} />
                <div className="heatmap-legend-square" style={{ backgroundColor: '#26a641' }} />
                <div className="heatmap-legend-square" style={{ backgroundColor: '#39d353' }} />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;