import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CompetitionContext = createContext();

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within CompetitionProvider');
  }
  return context;
};

export const CompetitionProvider = ({ children }) => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all competitions
  const fetchCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/competitions');
      setCompetitions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل جلب المسابقات');
      toast.error('فشل جلب المسابقات');
    } finally {
      setLoading(false);
    }
  };

  // Create new competition
  const createCompetition = async (competitionData) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/competitions', competitionData);
      setCompetitions([...competitions, res.data]);
      toast.success('تم إنشاء المسابقة بنجاح');
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل إنشاء المسابقة';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update competition
  const updateCompetition = async (id, competitionData) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/competitions/${id}`, competitionData);
      setCompetitions(competitions.map(comp => 
        comp._id === id ? res.data : comp
      ));
      toast.success('تم تحديث المسابقة بنجاح');
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل تحديث المسابقة';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Delete competition
  const deleteCompetition = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/competitions/${id}`);
      setCompetitions(competitions.filter(comp => comp._id !== id));
      toast.success('تم حذف المسابقة بنجاح');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل حذف المسابقة';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Join competition
  const joinCompetition = async (competitionId) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/competitions/${competitionId}/join`);
      setCompetitions(competitions.map(comp => 
        comp._id === competitionId ? { ...comp, participants: [...comp.participants, res.data.user] } : comp
      ));
      toast.success('تم الانضمام للمسابقة بنجاح');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل الانضمام للمسابقة';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Load competitions on mount
  useEffect(() => {
    fetchCompetitions();
  }, []);

  const value = {
    competitions,
    loading,
    error,
    fetchCompetitions,
    createCompetition,
    updateCompetition,
    deleteCompetition,
    joinCompetition
  };

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};
