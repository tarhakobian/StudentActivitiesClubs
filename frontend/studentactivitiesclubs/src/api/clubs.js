import axios from 'axios';

export const fetchClubs = async () => {
  try {
    const response = await axios.get('http://localhost:8080/clubs/');
    return response.data; 
  } catch (error) {
    throw new Error(error.message); 
  }
};

