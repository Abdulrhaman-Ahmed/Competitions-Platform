import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ScoreContext = createContext();

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within ScoreProvider');
  }
  return context;
};

export const ScoreProvider = ({ children }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch scores for a competition
  const fetchScores = async (competitionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/competitions/${competitionId}/scores`);
      setScores(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.message || 'فشل جلب النتائج');
      toast.error('فشل جلب النتائج');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Submit score for a participant
  const submitScore = async (competitionId, participantId, scoreData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/competitions/${competitionId}/participants/${participantId}/score`,
        scoreData
      );
      setScores([...scores, res.data]);
      toast.success('تم إرسال التقييم بنجاح');
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل إرسال التقييم';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update score
  const updateScore = async (competitionId, participantId, scoreId, scoreData) => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/competitions/${competitionId}/participants/${participantId}/scores/${scoreId}`,
        scoreData
      );
      setScores(scores.map(score => 
        score._id === scoreId ? res.data : score
      ));
      toast.success('تم تحديث التقييم بنجاح');
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل تحديث التقييم';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Calculate final scores
  const calculateFinalScores = async (competitionId) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/competitions/${competitionId}/calculate-scores`);
      setScores(res.data);
      toast.success('تم حساب النتائج النهائية بنجاح');
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل حساب النتائج';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get results for a competition
  const getResults = async (competitionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/competitions/${competitionId}/results`);
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.message || 'فشل جلب النتائج');
      toast.error('فشل جلب النتائج');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    scores,
    loading,
    error,
    fetchScores,
    submitScore,
    updateScore,
    calculateFinalScores,
    getResults
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
};
