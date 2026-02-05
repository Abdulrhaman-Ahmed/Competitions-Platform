import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/participants/my-competitions');
      const participated = res.data.data.filter(c => c.status === 'participated');
      setResults(participated);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-warning" />;
    if (rank === 2) return <FaMedal className="text-secondary" />;
    if (rank === 3) return <FaMedal className="text-danger" />;
    return <FaStar className="text-muted" />;
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
            <h3 className="fw-bold mb-1">النتائج</h3>
            <p className="text-muted">نتائج المسابقات المشارك بها</p>
          </div>

          {results.length === 0 ? (
            <div className="card-custom text-center py-5">
              <h5 className="text-muted">لا توجد نتائج بعد</h5>
              <p className="text-muted">انتظر حتى يتم الإعلان عن النتائج</p>
            </div>
          ) : (
            <div className="row g-4">
              {results.map((result) => (
                <div key={result.id} className="col-md-6 col-lg-4">
                  <div className="card-custom">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="fs-3">
                        {getRankIcon(result.rank || 0)}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{result.title}</h5>
                        <small className="text-muted">{result.category}</small>
                      </div>
                    </div>

                    <div className="bg-light rounded p-3 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">الدرجة:</span>
                        <span className="fw-bold fs-5">--/100</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">الترتيب:</span>
                        <span className="fw-semibold">--</span>
                      </div>
                    </div>

                    <div className="alert alert-info mb-0">
                      <small>⏳ جاري التحكيم، سيتم الإعلان عن النتائج قريباً</small>
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

export default StudentResults;