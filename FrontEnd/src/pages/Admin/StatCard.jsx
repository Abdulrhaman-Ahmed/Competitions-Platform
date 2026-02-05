const StatCard = ({ title, value, icon: Icon, colorClass = 'blue' }) => {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="d-flex align-items-center gap-3">
        <div className="stat-icon-wrapper">
          <Icon />
        </div>
        <div className="flex-grow-1">
          <p className="stat-title mb-2">{title}</p>
          <h2 className="stat-value">{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatCard;