import axios from 'axios';
import cheerio from 'cheerio';


function normalizeTitle(title){
  return title
  .toLowerCase()
  .replace(/[‘’]/g, "'") // Replace curly apostrophes with straight ones
  .replace(/[“”]/g, '"') // Replace curly quotes with straight quotes
  .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero width spaces
  .replace(/[^a-z0-9'"\s]/gi, '') // Remove special characters except for basic punctuation
  .trim();
}

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

    const firstHit = searchResponse.data.response.hits[0];
    //console.log(firstHit.result)
     if (!firstHit) {
      res.status(404).json({ message: 'No matching songs found.' });
      return;
    }
    
    const apiTitleLower = normalizeTitle(firstHit.result.title);
    const searchTitleLower = normalizeTitle(title);
    //console.log(`${apiTitleLower} : ${searchTitleLower}`)

    if (!searchTitleLower.includes(apiTitleLower)) {
      //console.log(`couldnt find ${apiTitleLower} in ${searchTitleLower}`)
      res.status(404).json({ message: 'No relevant matching songs found.' });
      return;
    }

    const lyricsUrl = firstHit.result.url;

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


/* 
Chimera by Polyphia (Ft. Lil West)
G.O.A.T. by Polyphia
Babe Ruthless by TERROR REID (Ft. Lu Baby)
Tokyo Smoke by Cage The Elephant
Mama's Boy by Dominic Fike
Need 2 by Pinegrove
Lagoon by Rich Brian
GOOD ENEMY by PVRIS
Frisky by Dominic Fike
Waltz in E-Major, Op. 15 "Moon Waltz" by Cojum Dip (Ft. Joe Hawley)
PISTOLWHIP by ​spill tab
​walking in the snow by Run The Jewels
POPTHATRUNK by 1nonly & Freddie Dredd
Wasted Summers by ​juju﹤3
Chimera by Polyphia (Ft. Lil West)
​is there a point (girl u know)
New Music Friday 11/17/23 by Spotify
*/