import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AdminParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/participants');
      setParticipants(res.data.data);
    } catch (error) {
      toast.error('فشل تحميل المشاركين');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/participants/${id}`, { status });
      toast.success('تم تحديث الحالة');
      fetchParticipants();
    } catch (error) {
      toast.error('فشل التحديث');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { variant: 'warning', text: 'قيد المراجعة' },
      approved: { variant: 'success', text: 'مقبول' },
      rejected: { variant: 'danger', text: 'مرفوض' },
      participated: { variant: 'secondary', text: 'تم الإرسال' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-custom"></div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="mb-4">
            <h3 className="fw-bold mb-1">المشاركون</h3>
            <p className="text-muted">إدارة المشاركين في المسابقات</p>
          </div>

          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>المشارك</th>
                    <th>البريد الإلكتروني</th>
                    <th>المسابقة</th>
                    <th>تاريخ التسجيل</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(participant => {
                    const badge = getStatusBadge(participant.status);
                    return (
                      <tr key={participant.id}>
                        <td className="fw-semibold">{participant.name}</td>
                        <td>{participant.email}</td>
                        <td>{participant.competition_title}</td>
                        <td>{new Date(participant.registration_date).toLocaleDateString('ar-EG')}</td>
                        <td>
                          <Badge variant={badge.variant}>
                            {badge.text}
                          </Badge>
                        </td>
                        <td>
                          {participant.status === 'pending' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => updateStatus(participant.id, 'approved')}
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => updateStatus(participant.id, 'rejected')}
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminParticipants;