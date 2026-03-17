import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MilestoneTracker = ({ currentSolved, target = 400 }) => {
  const percentage = Math.min(100, Math.round((currentSolved / target) * 100));
  const remaining = Math.max(0, target - currentSolved);

  // Darcula colors for the pie chart
  const data = [
    { name: 'Completed', value: currentSolved, color: '#629755' }, // Greenish for progress
    { name: 'Remaining', value: remaining, color: '#313335' }  // Dark grey for background track
  ];

  return (
    <div className="bg-[#313335] p-6 rounded-lg border border-[#4e5254] mt-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
      
      <div className="flex-1 mb-6 md:mb-0 md:pr-8">
         <h3 className="text-xl font-bold text-white mb-2">Milestone: {target} Questions</h3>
         <p className="text-[#A9B7C6] mb-4">
             You have conquered <span className="font-bold text-white">{currentSolved}</span> problems across all integrated platforms. 
             Only <span className="font-bold text-[#ED6A5E]">{remaining}</span> more to hit your next target marker.
         </p>
         
         {/* IDE-style Progress Bar */}
         <div className="w-full bg-[#242627] rounded-full h-4 border border-[#4e5254] overflow-hidden relative">
            <div 
               className="bg-gradient-to-r from-[#467CDA] to-[#629755] h-full rounded-full transition-all duration-1000 ease-out"
               style={{ width: `${percentage}%` }}
            ></div>
            {/* Glossy overlay effect to look like old IDE bars */}
            <div className="absolute inset-0 bg-white/10 w-full h-1/2 rounded-t-full"></div>
         </div>
         <div className="flex justify-between mt-2 text-xs font-mono text-[#808080]">
            <span>0</span>
            <span>{percentage}% Build Progress</span>
            <span>{target}</span>
         </div>
      </div>

      {/* Visual Chart Graphic */}
      <div className="w-48 h-48 relative">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 startAngle={90}
                 endAngle={-270}
                 stroke="none"
                 dataKey="value"
               >
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               {/* Custom IDE styled tooltip */}
               <Tooltip 
                  contentStyle={{ backgroundColor: '#2B2B2B', borderColor: '#4e5254', color: '#A9B7C6', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#white' }}
               />
            </PieChart>
         </ResponsiveContainer>
         
         <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
             <span className="text-3xl font-bold text-white">{percentage}%</span>
         </div>
      </div>

    </div>
  );
};

export default MilestoneTracker;
