import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FaCertificate, FaDownload, FaPrint } from 'react-icons/fa';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/certificates');
      setCertificates(res.data.data);
    } catch (error) {
      console.error('Error:', error);
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
            <p className="text-muted">إدارة الشهادات الصادرة</p>
          </div>

          {certificates.length === 0 ? (
            <div className="card-custom text-center py-5">
              <FaCertificate size={64} className="text-muted mb-3" />
              <h5 className="text-muted">لا توجد شهادات صادرة بعد</h5>
            </div>
          ) : (
            <div className="card-custom">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>رقم الشهادة</th>
                      <th>المشارك</th>
                      <th>البريد الإلكتروني</th>
                      <th>المسابقة</th>
                      <th>الدرجة</th>
                      <th>الترتيب</th>
                      <th>تاريخ الإصدار</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(cert => (
                      <tr key={cert.id}>
                        <td className="font-monospace small">{cert.certificate_code}</td>
                        <td className="fw-semibold">{cert.name}</td>
                        <td>{cert.email}</td>
                        <td>{cert.competition_title}</td>
                        <td>
                          <Badge variant="success">
                            {parseFloat(cert.final_score).toFixed(2)}
                          </Badge>
                        </td>
                        <td>
                          <Badge variant="primary">
                            #{cert.rank_position}
                          </Badge>
                        </td>
                        <td>{new Date(cert.issued_date).toLocaleDateString('ar-EG')}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            <FaDownload />
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <FaPrint />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;