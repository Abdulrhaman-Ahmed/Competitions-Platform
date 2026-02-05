import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaUpload, FaEye } from 'react-icons/fa';

const StudentMyCompetitions = () => {
  const [myCompetitions, setMyCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCompetitions();
  }, []);

  const fetchMyCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/participants/my-competitions');
      setMyCompetitions(res.data.data);
    } catch (error) {
      toast.error('فشل تحميل مسابقاتي');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-pending', text: 'قيد المراجعة' },
      approved: { class: 'badge-approved', text: 'مقبول' },
      rejected: { class: 'badge-rejected', text: 'مرفوض' },
      participated: { class: 'badge-completed', text: 'تم الإرسال' }
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
            <h3 className="fw-bold mb-1">مسابقاتي</h3>
            <p className="text-muted">المسابقات المسجل بها</p>
          </div>

          {myCompetitions.length === 0 ? (
            <div className="card-custom text-center py-5">
              <h5 className="text-muted">لم تسجل في أي مسابقة بعد</h5>
            </div>
          ) : (
            <div className="row g-4">
              {myCompetitions.map((comp) => {
                const badge = getStatusBadge(comp.status);
                return (
                  <div key={comp.id} className="col-md-6 col-lg-4">
                    <div className="card-custom">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="fw-bold mb-0">{comp.title}</h5>
                        <span className={`badge-custom ${badge.class}`}>
                          {badge.text}
                        </span>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">الفئة: </small>
                        <span className="badge badge-custom badge-blue">{comp.category}</span>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">تاريخ التسجيل:</small>
                        <span>{new Date(comp.registration_date).toLocaleDateString('ar-EG')}</span>
                      </div>

                      {comp.submission_date && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">تاريخ الإرسال:</small>
                          <span>{new Date(comp.submission_date).toLocaleDateString('ar-EG')}</span>
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        {comp.status === 'approved' && !comp.submission_file && (
                          <button className="btn btn-custom-primary btn-sm flex-grow-1">
                            <FaUpload className="me-2" />
                            رفع العمل
                          </button>
                        )}
                        <button className="btn btn-outline-secondary btn-sm">
                          <FaEye className="me-2" />
                          التفاصيل
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMyCompetitions;