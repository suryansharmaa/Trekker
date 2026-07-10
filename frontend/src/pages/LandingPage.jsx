import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codeforces: "",
    gfg: "",
  });

  const handleChange = (e) => {
    setUsernames({
      ...usernames,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usernames.leetcode && !usernames.codeforces && !usernames.gfg) {
      alert("Please enter at least one username to sync.");
      return;
    }
    // Encode state and navigate to dashboard
    navigate("/dashboard", {
      state: {
        leetcodeUsername: usernames.leetcode,
        codeforcesUsername: usernames.codeforces,
        gfgUsername: usernames.gfg,
      },
    });
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="bg-[#313335] p-8 rounded-lg border border-[#4e5254] shadow-2xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Platform Integration</h1>
          <p className="text-sm text-[#808080]">
            Provide platform handles for data synchronization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leetcode Input */}
          <div className="space-y-1 group">
            <label className="text-xs text-[#808080] uppercase tracking-wide group-focus-within:text-[#CC7832] transition-colors">
              Leetcode Handle
            </label>
            <input
              type="text"
              name="leetcode"
              value={usernames.leetcode}
              onChange={handleChange}
              placeholder="username"
              className="w-full bg-[#2B2B2B] text-[#A9B7C6] border border-[#4e5254] rounded px-3 py-2 outline-none focus:border-[#467CDA] focus:ring-1 focus:ring-[#467CDA] transition-all font-mono"
            />
          </div>

          {/* Codeforces Input */}
          <div className="space-y-1 group">
            <label className="text-xs text-[#808080] uppercase tracking-wide group-focus-within:text-[#467CDA] transition-colors">
              Codeforces Handle
            </label>
            <input
              type="text"
              name="codeforces"
              value={usernames.codeforces}
              onChange={handleChange}
              placeholder="username"
              className="w-full bg-[#2B2B2B] text-[#A9B7C6] border border-[#4e5254] rounded px-3 py-2 outline-none focus:border-[#467CDA] focus:ring-1 focus:ring-[#467CDA] transition-all font-mono"
            />
          </div>

          {/* GeeksForGeeks Input */}
          <div className="space-y-1 group">
            <label className="text-xs text-[#808080] uppercase tracking-wide group-focus-within:text-[#629755] transition-colors">
              GeeksForGeeks Handle
            </label>
            <input
              type="text"
              name="gfg"
              value={usernames.gfg}
              onChange={handleChange}
              placeholder="username"
              className="w-full bg-[#2B2B2B] text-[#A9B7C6] border border-[#4e5254] rounded px-3 py-2 outline-none focus:border-[#467CDA] focus:ring-1 focus:ring-[#467CDA] transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#365880] hover:bg-[#2F65CA] text-white font-medium py-2 px-4 rounded transition-colors mt-4 shadow-sm border border-[#4e5254]"
          >
            Synchronize
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
