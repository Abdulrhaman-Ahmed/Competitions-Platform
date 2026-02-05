import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FaStar } from 'react-icons/fa';

const JudgeJudging = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedComp, setSelectedComp] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/judges/my-competitions');
      setCompetitions(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedComp(res.data.data[0].competition_id);
        fetchParticipants(res.data.data[0].competition_id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchParticipants = async (compId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/judges/competition/${compId}/participants`);
      setParticipants(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/scores', {
        participant_id: selectedParticipant.id,
        score: parseFloat(score),
        feedback
      });
      toast.success('تم إرسال التقييم بنجاح');
      setShowModal(false);
      setScore('');
      setFeedback('');
      fetchParticipants(selectedComp);
    } catch (error) {
      toast.error('فشل إرسال التقييم');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="mb-4">
            <h3 className="fw-bold mb-1">التحكيم</h3>
            <p className="text-muted">تقييم المشاركين</p>
          </div>

          {competitions.length > 0 && (
            <div className="mb-4">
              <select
                className="form-select"
                value={selectedComp}
                onChange={(e) => {
                  setSelectedComp(e.target.value);
                  fetchParticipants(e.target.value);
                }}
              >
                {competitions.map(comp => (
                  <option key={comp.competition_id} value={comp.competition_id}>
                    {comp.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {participants.length === 0 ? (
            <div className="card-custom text-center py-5">
              <h5 className="text-muted">لا يوجد مشاركون للتحكيم</h5>
            </div>
          ) : (
            <div className="card-custom">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>اسم المشارك</th>
                      <th>البريد الإلكتروني</th>
                      <th>تاريخ الإرسال</th>
                      <th>متوسط الدرجات</th>
                      <th>عدد المحكمين</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map(participant => (
                      <tr key={participant.id}>
                        <td className="fw-semibold">{participant.name}</td>
                        <td>{participant.email}</td>
                        <td>{new Date(participant.submission_date).toLocaleDateString('ar-EG')}</td>
                        <td>
                          {participant.avg_score ? (
                            <Badge variant="success">
                              {parseFloat(participant.avg_score).toFixed(2)}
                            </Badge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>{participant.judges_count || 0}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedParticipant(participant);
                              setShowModal(true);
                            }}
                          >
                            <FaStar className="me-2" />
                            تقييم
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

      {/* Score Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="تقييم المشارك"
        footer={
          <>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleSubmitScore}>
              إرسال التقييم
            </Button>
          </>
        }
      >
        {selectedParticipant && (
          <div className="mb-3">
            <strong>المشارك: </strong>{selectedParticipant.name}
          </div>
        )}

        <form onSubmit={handleSubmitScore}>
          <div className="mb-3">
            <label className="form-label fw-semibold">الدرجة (من 0 إلى 100)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              max="100"
              step="0.01"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">التعليقات والملاحظات</label>
            <textarea
              className="form-control"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="اكتب ملاحظاتك وتعليقاتك هنا..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JudgeJudging;