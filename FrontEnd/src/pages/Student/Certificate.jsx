import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaCertificate, FaDownload, FaShare } from 'react-icons/fa';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/certificates/my-certificates');
      setCertificates(res.data.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
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
            <h3 className="fw-bold mb-1">الشهادات</h3>
            <p className="text-muted">شهادات المسابقات الحاصل عليها</p>
          </div>

          {certificates.length === 0 ? (
            <div className="card-custom text-center py-5">
              <FaCertificate size={64} className="text-muted mb-3" />
              <h5 className="text-muted">لا توجد شهادات بعد</h5>
              <p className="text-muted">شارك في المسابقات للحصول على الشهادات</p>
            </div>
          ) : (
            <div className="row g-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="col-md-6 col-lg-4">
                  <div className="card-custom border-primary">
                    <div className="text-center mb-3">
                      <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3"
                           style={{ width: '80px', height: '80px' }}>
                        <FaCertificate size={40} className="text-primary" />
                      </div>
                      <h5 className="fw-bold mb-1">{cert.competition_title}</h5>
                      <small className="text-muted">{cert.category}</small>
                    </div>

                    <div className="bg-light rounded p-3 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">رقم الشهادة:</span>
                        <span className="fw-semibold small">{cert.certificate_code}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">الدرجة النهائية:</span>
                        <span className="fw-bold">{parseFloat(cert.final_score).toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">الترتيب:</span>
                        <span className="fw-bold">#{cert.rank_position}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">تاريخ الإصدار: </small>
                      <span>{new Date(cert.issued_date).toLocaleDateString('ar-EG')}</span>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-custom-primary btn-sm flex-grow-1">
                        <FaDownload className="me-2" />
                        تحميل
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <FaShare className="me-2" />
                        مشاركة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;