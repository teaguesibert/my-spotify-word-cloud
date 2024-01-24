import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import WordCloud from '../components/WordCloud';
import { getTopTracks } from '../lib/spotify';
import { getSongInfo } from '../lib/lyrics';
import ThemeButton from '../components/ThemeButton';
import  { Sansita_Swashed } from 'next/font/google';
import { stopWords } from '../lib/stopWords';
import { Footer } from '../components/Footer';

const sansita = Sansita_Swashed({
  subsets: ['latin'],
  variable: '--font-sansita',
  weight: '700',
  display: 'swap',
})


// Function to process lyrics into the format expected by WordCloud

const processLyricsToWords = (lyrics) => {
  if (!lyrics) return [];

  // Insert spaces around HTML tags to prevent concatenation of adjacent words
  const spacedLyrics = lyrics.replace(/<[^>]+>/g, ' ');

  // Use a comprehensive regex to split the lyrics into words, accounting for various punctuation
  const words = spacedLyrics.split(/[\s,.!?;:()<>[\]\/]+/).filter(Boolean);
  const wordCounts = {};

  words.forEach(rawWord => {
    // Clean the word and handle special characters and cases
    const cleanedWords = rawWord.toLowerCase()
                                .replace(/['’]/g, "")
                                .split(/[^a-zA-Z'-]/)
                                .filter(Boolean);

    cleanedWords.forEach(cleanedWord => {
      // Further break down words that might be concatenated
      const subWords = cleanedWord.match(/\b[\w'-]+\b/g) || [cleanedWord];

      subWords.forEach(subWord => {
        // Split any remaining concatenated words
        const splitSubWords = subWord.split(/(?=[A-Z])/).filter(Boolean);

        splitSubWords.forEach(finalWord => {
          if (!stopWords.has(finalWord) && finalWord.length > 1 && isNaN(finalWord)) {
            wordCounts[finalWord] = (wordCounts[finalWord] || 0) + 1;
          }
        });
      });
    });
  });

  return Object.keys(wordCounts).map(word => ({
    text: word,
    value: wordCounts[word],
  }));
};









const IndexPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [lyrics, setLyrics] = useState([]);
  const [error, setError] = useState(false); // New state for handling errors
  const [topTracks, setTopTracks] = useState([]);


  useEffect(() => {
    const fetchLyrics = async () => {
      if (session) {
        try {
          const tracks = await getTopTracks(session.accessToken);
          setTopTracks(tracks); // Save top tracks to state
          
          const trackLyricsPromises = tracks.map(track =>
            getSongInfo(track.artists[0].name, track.name).catch(e => null)
        );
          const trackLyrics = await Promise.all(trackLyricsPromises);
          // Process and flatten the lyrics
          const allProcessedLyrics = trackLyrics
            .filter(lyric => lyric != null) // Filter out null values
            .map(lyric => processLyricsToWords(lyric)) // Process each set of lyrics
            .flat() // Flatten the array of arrays into a single array
            .sort((a, b) => b.value - a.value).slice(0, 200);
            if (JSON.stringify(allProcessedLyrics) !== JSON.stringify(lyrics)) {
            setLyrics(allProcessedLyrics); // Update the state with combined lyrics
            }
          setError(false);
        } catch (err) {
          console.error('Error fetching top tracks:', err);
          setError(true);
        }
      }
    };
  
    if (session) {
      fetchLyrics();
    }
  }, [session]);
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session || error) { // Show sign-in button if not authenticated or if there's an error
    return (
        <div className="flex flex-col min-h-screen animated-background">
          <div className="flex-grow flex flex-col justify-center items-center p-4 overflow-hidden dark:text-white">
            <h1 className={`${sansita.className}  text-5xl md:text-6xl lg:text-7xl mb-6 px-4 drop-shadow-lg`}>
              Lyric-Cloud
            </h1>
            <button 
              onClick={() => signIn('spotify', { callbackUrl: '/' })}
              className='bg-mintgreen-400 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-110 my-4 mx-auto'>
              Sign in with Spotify
            </button>
            {error && <p className="text-red-400 mt-4 px-4">Session expired. Please sign in again.</p>}
          </div>
          <Footer/>
        </div>
      
    );
  }

  return (
    <div className="min-h-screen animated-background overflow-hidden">
  {/* Render the WordCloud component with the fetched lyrics */}
  <div className="flex justify-center">
    <WordCloud words={lyrics} className="w-full max-w-4xl h-auto" />
  </div>

  <div className="container mx-auto p-4">
  <hr className="h-px my-8 dark:bg-gray-200 border-0 bg-gray-700"></hr>
  <h2 className="text-xl font-bold dark:text-white mb-4">Top Tracks</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <ul className="list-inside dark:text-gray-300">
      {topTracks.slice(0, Math.ceil(topTracks.length / 2)).map((track, index) => (
        <li key={index} className="mb-1 truncate hover:text-mintgreen-300 hover:scale-105 hover:list-disc">
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            {track.name} by {track.artists.map(artist => artist.name).join(', ')}
          </a>
        </li>
      ))}
    </ul>
    <ul className="list-inside dark:text-gray-300">
      {topTracks.slice(Math.ceil(topTracks.length / 2), topTracks.length).map((track, index) => (
        <li key={index} className="mb-1 truncate hover:text-mintgreen-300 hover:scale-105 hover:list-disc">
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            {track.name} by {track.artists.map(artist => artist.name).join(', ')}
          </a>
        </li>
      ))}
    </ul>
  </div>
</div>
<Footer />
</div>


  );
};

export default IndexPage;
