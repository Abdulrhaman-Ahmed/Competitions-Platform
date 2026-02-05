import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { FaUserPlus } from 'react-icons/fa';

const AdminJudges = () => {
  const [judges, setJudges] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState('');
  const [selectedComp, setSelectedComp] = useState('');

  useEffect(() => {
    fetchJudges();
    fetchCompetitions();
  }, []);

  const fetchJudges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/judges');
      setJudges(res.data.data);
    } catch (error) {
      toast.error('فشل تحميل المحكمين');
    }
  };

  const fetchCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/competitions');
      setCompetitions(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/judges/assign', {
        user_id: selectedJudge,
        competition_id: selectedComp
      });
      toast.success('تم تعيين المحكم بنجاح');
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل التعيين');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">المحكمون</h3>
              <p className="text-muted mb-0">إدارة وتعيين المحكمين</p>
            </div>
            <button className="btn btn-custom-primary" onClick={() => setShowModal(true)}>
              <FaUserPlus className="me-2" />
              تعيين محكم
            </button>
          </div>

          <div className="row g-4">
            {judges.map(judge => (
              <div key={judge.id} className="col-md-6 col-lg-4">
                <div className="card-custom">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                         style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                      {judge.name.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1">{judge.name}</h5>
                      <small className="text-muted">{judge.email}</small>
                    </div>
                  </div>

                  <div className="bg-light rounded p-2 text-center">
                    <small className="text-muted">محكم نشط</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تعيين محكم لمسابقة</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAssign}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>المحكم</Form.Label>
              <Form.Select
                value={selectedJudge}
                onChange={(e) => setSelectedJudge(e.target.value)}
                required
              >
                <option value="">اختر المحكم</option>
                {judges.map(judge => (
                  <option key={judge.id} value={judge.id}>
                    {judge.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>المسابقة</Form.Label>
              <Form.Select
                value={selectedComp}
                onChange={(e) => setSelectedComp(e.target.value)}
                required
              >
                <option value="">اختر المسابقة</option>
                {competitions.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit">
              تعيين
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminJudges;