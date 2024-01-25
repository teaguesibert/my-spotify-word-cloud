import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { artist, title } = req.query;

  try {
    const apiUrl = `https://api.genius.com/search`;
    const searchResponse = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
      },
      params: {
        q: `${title} ${artist}`,
      },
    });

    const hits = searchResponse.data.response.hits;
    const songMatch = hits.find(hit => hit.result.primary_artist.name.toLowerCase() === artist.toLowerCase() && hit.result.title.toLowerCase() === title.toLowerCase());

    if (!songMatch) {
      res.status(404).json({ message: 'No matching songs found.' });
      return;
    }

    const lyricsUrl = songMatch.result.url;
    const pageResponse = await axios.get(lyricsUrl);
    const $ = cheerio.load(pageResponse.data);

    // Replace 'LYRICS_SELECTOR' with the actual selector for lyrics on the Genius page.
    const lyrics = $('[data-lyrics-container="true"]').text();

    if (!lyrics) {
      res.status(404).json({ message: 'Lyrics not found.' });
      return;
    }

    res.status(200).json({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}
