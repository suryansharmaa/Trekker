import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#2B2B2B] text-[#A9B7C6] font-sans flex flex-col">
      {/* Top Navigation Bar mimicking an IDE top bar */}
      <nav className="bg-[#3C3F41] border-b border-[#242627] flex items-center justify-between px-6 py-3 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            {/* Fake Mac window buttons for IDE vibe */}
            <div className="w-3 h-3 rounded-full bg-[#ED6A5E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F4BF4F]"></div>
            <div className="w-3 h-3 rounded-full bg-[#61C554]"></div>
          </div>
          <Link
            to="/"
            className="text-[#A9B7C6] font-bold text-lg hover:text-white transition-colors"
          >
            Trekker
          </Link>
        </div>

        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-[#A9B7C6] hover:text-[#467CDA] transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/visualizer"
            className="text-[#A9B7C6] hover:text-[#629755] transition-colors text-sm font-medium"
          >
            Merge-Sort Visualizer()
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 flex flex-col max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Footer / Status Bar mimicking IDE bottom bar */}
      <footer className="bg-[#3C3F41] border-t border-[#242627] px-4 py-1 text-xs text-[#808080] flex justify-between">
        <div>Ready</div>
        <div>UTF-8 | 4 spaces | main</div>
      </footer>
    </div>
  );
};

export default Layout;
