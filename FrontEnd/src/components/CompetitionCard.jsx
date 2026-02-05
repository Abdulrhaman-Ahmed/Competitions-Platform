import { FaCalendar, FaUsers, FaTrophy, FaUserPlus } from 'react-icons/fa';
import Badge from './Badge';
import Button from './Button';

const CompetitionCard = ({ competition, onViewDetails, onRegister }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { variant: 'info', text: 'قادمة' },
      active: { variant: 'success', text: 'نشطة' },
      completed: { variant: 'secondary', text: 'منتهية' }
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="card-custom h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="mb-3">
          {getStatusBadge(competition.status)}
        </div>
        <FaTrophy className="text-primary" size={24} />
      </div>

      <h5 className="fw-bold mb-3">{competition.title}</h5>
      <p className="text-muted mb-4">{competition.description}</p>

      <div className="d-flex gap-3 text-muted mb-4">
        <div className="d-flex align-items-center gap-2">
          <FaCalendar />
          <small>{new Date(competition.startDate).toLocaleDateString('ar-EG')}</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <FaUsers />
          <small>{competition.participants?.length || 0} مشارك</small>
        </div>
      </div>

      <div className="d-flex gap-2">
        <Button 
          variant="outline-primary" 
          className="flex-grow-1"
          onClick={() => onViewDetails(competition)}
        >
          عرض التفاصيل
        </Button>
        {onRegister && competition.status === 'upcoming' && (
          <Button 
            variant="primary"
            onClick={() => onRegister(competition.id)}
          >
            <FaUserPlus />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompetitionCard;
