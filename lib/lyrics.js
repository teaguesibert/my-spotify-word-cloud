import axios from 'axios';


const getSongInfo = async (artist, title) => {
  try {
    const response = await axios.get(`/api/lyrics`, {
      params: { artist, title },
    });

    // Directly return the lyrics text if the API was successful
    return response.data.lyrics || null;
  } catch (error) {
    console.error('Error fetching song info:', error);
    return null;
  }
};

export { getSongInfo };