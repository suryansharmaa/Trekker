import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, RefreshCw } from "lucide-react";
import MilestoneTracker from "../components/MilestoneTracker";

const StatCard = ({ title, value, color }) => (
  <div className="bg-[#313335] p-6 rounded-lg border border-[#4e5254] flex flex-col justify-between">
    <h3 className="text-[#A9B7C6] text-sm uppercase tracking-wider mb-2 font-mono">
      {title}
    </h3>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

const PlatformCard = ({ platform, data, themeColor }) => {
  if (!data) return null;

  return (
    <div className="bg-[#313335] rounded-lg border border-[#4e5254] overflow-hidden">
      <div className="bg-[#3C3F41] px-4 py-2 border-b border-[#242627] flex items-center justify-between">
        <span className={`font-mono text-sm tracking-wide ${themeColor}`}>
          {platform}.java
        </span>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#808080] text-xs font-mono">Username</p>
            <p className="text-white font-medium">{data.username}</p>
          </div>
          <div>
            <p className="text-[#808080] text-xs font-mono">Total Solved</p>
            <p className="text-white font-medium">{data.totalSolved}</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="space-y-2 pt-2 border-t border-[#4e5254]">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#629755]">Easy</span>
            <span className="text-white font-mono">{data.easySolved}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#F4BF4F]">Medium</span>
            <span className="text-white font-mono">{data.mediumSolved}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#ED6A5E]">Hard</span>
            <span className="text-white font-mono">{data.hardSolved}</span>
          </div>
        </div>

        {data.rating > 0 && (
          <div className="pt-2 border-t border-[#4e5254] flex justify-between items-center">
            <span className="text-[#808080] text-xs font-mono uppercase">
              Rating
            </span>
            <span className="text-[#A9B7C6] font-bold">{data.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const usernames = location.state;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    if (!usernames) {
      navigate("/");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stats`,
        usernames,
      );
      setStats(response.data);
    } catch (err) {
      let msg = err.message;
      if (err.response && err.response.data && err.response.data.error) {
        msg = err.response.data.error;
      } else if (err.code === "ERR_NETWORK") {
        msg =
          "Network Error: Cannot reach http://localhost:5000. Ensure the backend server is running.";
      }
      setError(`Failed to fetch data: ${msg}`);
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#467CDA] animate-spin" />
        <p className="text-[#A9B7C6] font-mono animate-pulse">
          Compiling User Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#482828] border border-[#ff5252] text-[#ff5252] p-4 rounded font-mono mt-8">
        <p>Error: {error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-white underline hover:text-gray-300"
        >
          Return to Configuration
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Aggregate totals
  const totalSolved =
    (stats.leetcode?.totalSolved || 0) +
    (stats.codeforces?.totalSolved || 0) +
    (stats.geeksforgeeks?.totalSolved || 0);
  const totalEasy =
    (stats.leetcode?.easySolved || 0) +
    (stats.codeforces?.easySolved || 0) +
    (stats.geeksforgeeks?.easySolved || 0);
  const totalMedium =
    (stats.leetcode?.mediumSolved || 0) +
    (stats.codeforces?.mediumSolved || 0) +
    (stats.geeksforgeeks?.mediumSolved || 0);
  const totalHard =
    (stats.leetcode?.hardSolved || 0) +
    (stats.codeforces?.hardSolved || 0) +
    (stats.geeksforgeeks?.hardSolved || 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-[#4e5254] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Project Portfolio
          </h1>
          <p className="text-[#808080] text-sm font-mono">
            Last synced: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-2 bg-[#313335] hover:bg-[#3C3F41] border border-[#4e5254] px-3 py-1.5 rounded transition-colors text-sm text-[#A9B7C6]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Rebuild</span>
        </button>
      </div>

      {/* Aggregated Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Solved"
          value={totalSolved}
          color="text-[#467CDA]"
        />
        <StatCard title="Easy" value={totalEasy} color="text-[#629755]" />
        <StatCard title="Medium" value={totalMedium} color="text-[#F4BF4F]" />
        <StatCard title="Hard" value={totalHard} color="text-[#ED6A5E]" />
      </div>

      {/* Platform Breakdown */}
      <h2 className="text-xl font-bold text-white mt-12 mb-4">
        Platform Modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlatformCard
          platform="LeetCode"
          data={stats.leetcode}
          themeColor="text-[#CC7832]"
        />
        <PlatformCard
          platform="Codeforces"
          data={stats.codeforces}
          themeColor="text-[#467CDA]"
        />
        <PlatformCard
          platform="GeeksForGeeks"
          data={stats.geeksforgeeks}
          themeColor="text-[#61C554]"
        />
      </div>

      {/* Milestone Tracker Component */}
      <MilestoneTracker currentSolved={totalSolved} target={400} />
    </div>
  );
};

export default DashboardContainer;
