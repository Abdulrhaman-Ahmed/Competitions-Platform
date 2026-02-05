import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FaCertificate, FaDownload, FaTrophy } from 'react-icons/fa';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/certificates/my-certificates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const downloadCertificate = async (certificateId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/certificates/${certificateId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('فشل تحميل الشهادة. يرجى المحاولة مرة أخرى.');
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
      <div className="flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">شهاداتي</h2>
            <p className="text-muted mb-0">
              إجمالي الشهادات: {certificates.length}
            </p>
          </div>

          {certificates.length === 0 ? (
            <Card className="text-center py-5">
              <div className="mb-3">
                <FaCertificate size={60} className="text-muted" />
              </div>
              <h4 className="mb-3">لا توجد شهادات بعد</h4>
              <p className="text-muted mb-4">
                شارك في المسابقات واحصل على شهادات عند الفوز
              </p>
              <Button variant="primary" onClick={() => window.location.href = '/student/competitions'}>
                تصفح المسابقات
              </Button>
            </Card>
          ) : (
            <div className="row g-4">
              {certificates.map((certificate) => (
                <div key={certificate._id} className="col-md-6 col-lg-4">
                  <Card 
                    className="h-100"
                    footer={
                      <Button 
                        variant="outline-primary" 
                        className="w-100"
                        onClick={() => downloadCertificate(certificate._id)}
                      >
                        <FaDownload className="ms-2" />
                        تحميل الشهادة
                      </Button>
                    }
                  >
                    <div className="text-center mb-3">
                      <FaTrophy size={50} className="text-warning mb-2" />
                      <Badge variant="success">{certificate.rank}</Badge>
                    </div>
                    <h4 className="mb-3 text-center">{certificate.competitionTitle}</h4>
                    <p className="text-muted mb-3 text-center">
                      صدرت في: {new Date(certificate.issuedDate).toLocaleDateString('ar-EG')}
                    </p>
                    <div className="text-center">
                      <small className="text-muted">
                        رقم الشهادة: {certificate.certificateNumber}
                      </small>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
