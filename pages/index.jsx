import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import WordCloud from '../components/WordCloud';
import { getTopTracks } from '../lib/spotify';
import { getSongInfo } from '../lib/lyrics';
import  { Sansita_Swashed } from 'next/font/google';
import { stopWords } from '../lib/stopWords';
import { Footer } from '../components/Footer/Footer';
import TopTracksList from '../components/TopTracksList';
import nlp from "compromise";

const sansita = Sansita_Swashed({
  subsets: ['latin'],
  variable: '--font-sansita',
  weight: '700',
  display: 'swap',
})


// Function to process lyrics into the format expected by WordCloud

const processLyricsToWords = (lyrics) => {
  if (!lyrics) return [];

  // Use compromise to tokenize the lyrics
  let doc = nlp(lyrics);
  let tokens = doc.terms().out('array');
  console.log(tokens)
  // Convert tokens to lowercase and filter out non-alphabetic tokens
  tokens = tokens.map(token => token.toLowerCase()).filter(token => token.match(/^[a-z'-]+$/));

  const wordCounts = {};
  
  tokens.forEach(token => {
    // Ensure the token is not a stop word and has more than one character
    if (!stopWords.has(token) && token.length > 1) {
      wordCounts[token] = (wordCounts[token] || 0) + 1;
    }
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
    <div className="min-h-screen animated-background overflow-hidden flex flex-col justify-between">
      <div className="flex justify-center">
        <WordCloud words={lyrics} className="w-full max-w-4xl h-auto" />
        
      </div>
      <TopTracksList topTracks={topTracks} />
      <Footer />
    </div>


  );
};

export default IndexPage;
