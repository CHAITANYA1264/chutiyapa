// StatsCard.js
const StatsCard = ({ title, value, onClick }) => {
  return (
    <div
      className="bg-white shadow rounded-xl p-4 text-center  cursor-pointer text-blue-500"
      onClick={onClick}  // Ensure onClick is properly passed and attached
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;

  