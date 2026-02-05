import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FaTrophy, FaMedal, FaCertificate } from 'react-icons/fa';

const AdminResults = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedComp, setSelectedComp] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/competitions');
      setCompetitions(res.data.data.filter(c => c.status === 'completed' || c.status === 'ongoing'));
      if (res.data.data.length > 0) {
        setSelectedComp(res.data.data[0].id);
        fetchResults(res.data.data[0].id);
      }
    } catch (error) {
      toast.error('فشل تحميل المسابقات');
    }
  };

  const fetchResults = async (compId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/scores/competition/${compId}/results`);
      setResults(res.data.data);
    } catch (error) {
      toast.error('فشل تحميل النتائج');
    } finally {
      setLoading(false);
    }
  };

  const generateCertificates = async () => {
    try {
      await axios.post(`http://localhost:5000/api/certificates/generate/${selectedComp}`);
      toast.success('تم إصدار الشهادات بنجاح');
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إصدار الشهادات');
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-warning fs-4" />;
    if (rank === 2) return <FaMedal className="text-secondary fs-4" />;
    if (rank === 3) return <FaMedal className="text-danger fs-4" />;
    return <span className="fw-bold">#{rank}</span>;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">النتائج</h3>
              <p className="text-muted mb-0">نتائج المسابقات والترتيب</p>
            </div>
            <Button
              variant="success"
              onClick={generateCertificates}
              disabled={!selectedComp || results.length === 0}
            >
              <FaCertificate className="me-2" />
              إصدار الشهادات
            </Button>
          </div>

          {competitions.length > 0 && (
            <div className="mb-4">
              <select
                className="form-select"
                value={selectedComp}
                onChange={(e) => {
                  setSelectedComp(e.target.value);
                  fetchResults(e.target.value);
                }}
              >
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-custom"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="card-custom text-center py-5">
              <h5 className="text-muted">لا توجد نتائج بعد</h5>
              <p className="text-muted">انتظر حتى يكمل المحكمون التقييم</p>
            </div>
          ) : (
            <div className="card-custom">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>الترتيب</th>
                      <th>المشارك</th>
                      <th>البريد الإلكتروني</th>
                      <th>الدرجة النهائية</th>
                      <th>عدد المحكمين</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(result => (
                      <tr key={result.id} className={result.rank <= 3 ? 'table-light' : ''}>
                        <td className="text-center">
                          {getRankIcon(result.rank)}
                        </td>
                        <td className="fw-semibold">{result.name}</td>
                        <td>{result.email}</td>
                        <td>
                          <Badge variant="success">
                            {result.final_score}
                          </Badge>
                        </td>
                        <td>{result.judges_count}</td>
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

export default AdminResults;