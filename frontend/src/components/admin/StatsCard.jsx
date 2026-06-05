import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <FaArrowUp className="text-green-500 text-sm" />
              ) : (
                <FaArrowDown className="text-red-500 text-sm" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className={`${color} p-3 rounded-full text-white`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;