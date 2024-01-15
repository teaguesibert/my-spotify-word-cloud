import axios from 'axios';

const getTopTracks = async (token) => {
  const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });console.log(response.data.items)
  return response.data.items;
};

export { getTopTracks };
