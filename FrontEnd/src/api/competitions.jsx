import axios from 'axios';

// استخدام Env Variable بدل localhost
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Get all competitions
export const getAllCompetitions = async () => {
  const response = await axios.get(`${API_BASE_URL}/competitions`);
  return response.data;
};

// Get competition by ID
export const getCompetitionById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/competitions/${id}`);
  return response.data;
};

// Create new competition
export const createCompetition = async (competitionData) => {
  const response = await axios.post(`${API_BASE_URL}/competitions`, competitionData);
  return response.data;
};

// Update competition
export const updateCompetition = async (id, competitionData) => {
  const response = await axios.put(`${API_BASE_URL}/competitions/${id}`, competitionData);
  return response.data;
};

// Delete competition
export const deleteCompetition = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/competitions/${id}`);
  return response.data;
};

// Join competition
export const joinCompetition = async (competitionId) => {
  const response = await axios.post(`${API_BASE_URL}/competitions/${competitionId}/join`);
  return response.data;
};

// Get competition participants
export const getCompetitionParticipants = async (competitionId) => {
  const response = await axios.get(`${API_BASE_URL}/competitions/${competitionId}/participants`);
  return response.data;
};

// Submit score for participant
export const submitScore = async (competitionId, participantId, scoreData) => {
  const response = await axios.post(
    `${API_BASE_URL}/competitions/${competitionId}/participants/${participantId}/score`,
    scoreData
  );
  return response.data;
};

// Get competition results
export const getCompetitionResults = async (competitionId) => {
  const response = await axios.get(`${API_BASE_URL}/competitions/${competitionId}/results`);
  return response.data;
};

// Get user's competitions
export const getUserCompetitions = async () => {
  const response = await axios.get(`${API_BASE_URL}/competitions/my-competitions`);
  return response.data;
};

// Get assigned competitions for judge
export const getAssignedCompetitions = async () => {
  const response = await axios.get(`${API_BASE_URL}/competitions/assigned`);
  return response.data;
};
