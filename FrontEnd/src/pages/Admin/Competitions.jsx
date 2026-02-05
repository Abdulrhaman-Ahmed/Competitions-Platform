import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const AdminCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'science',
    start_date: '',
    end_date: '',
    max_participants: '',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/competitions');
      setCompetitions(res.data.data);
    } catch (error) {
      toast.error('فشل تحميل المسابقات');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/competitions/${editing}`, formData);
        toast.success('تم تحديث المسابقة بنجاح');
      } else {
        await axios.post('http://localhost:5000/api/competitions', formData);
        toast.success('تم إضافة المسابقة بنجاح');
      }
      setShowModal(false);
      fetchCompetitions();
      resetForm();
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المسابقة؟')) {
      try {
        await axios.delete(`http://localhost:5000/api/competitions/${id}`);
        toast.success('تم حذف المسابقة');
        fetchCompetitions();
      } catch (error) {
        toast.error('فشل الحذف');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'science',
      start_date: '',
      end_date: '',
      max_participants: '',
      status: 'upcoming'
    });
    setEditing(null);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">إدارة المسابقات</h3>
              <p className="text-muted mb-0">إضافة وتعديل المسابقات</p>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" /> إضافة مسابقة
            </Button>
          </div>

          <div className="card-custom">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>العنوان</th>
                    <th>الفئة</th>
                    <th>تاريخ البداية</th>
                    <th>تاريخ النهاية</th>
                    <th>الحالة</th>
                    <th>المشاركون</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {competitions.map(comp => (
                    <tr key={comp.id}>
                      <td className="fw-semibold">{comp.title}</td>
                      <td>
                        <Badge variant="primary">{comp.category}</Badge>
                      </td>
                      <td>{new Date(comp.start_date).toLocaleDateString('ar-EG')}</td>
                      <td>{new Date(comp.end_date).toLocaleDateString('ar-EG')}</td>
                      <td>
                        <Badge 
                          variant={
                            comp.status === 'ongoing' ? 'success' :
                            comp.status === 'completed' ? 'secondary' :
                            'info'
                          }
                        >
                          {comp.status === 'ongoing' ? 'جارية' :
                           comp.status === 'completed' ? 'منتهية' : 'قادمة'}
                        </Badge>
                      </td>
                      <td>{comp.participant_count || 0}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            setEditing(comp.id);
                            setFormData(comp);
                            setShowModal(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(comp.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editing ? 'تعديل مسابقة' : 'إضافة مسابقة جديدة'}
        size="lg"
        footer={
          <>
            <Button variant="outline-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              {editing ? 'تحديث' : 'إضافة'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">عنوان المسابقة</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">الوصف</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold">الفئة</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="science">علوم</option>
                  <option value="sports">رياضة</option>
                  <option value="art">فن</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold">الحالة</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="upcoming">قادمة</option>
                  <option value="ongoing">جارية</option>
                  <option value="completed">منتهية</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">تاريخ البداية</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">تاريخ النهاية</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">الحد الأقصى للمشاركين</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCompetitions;