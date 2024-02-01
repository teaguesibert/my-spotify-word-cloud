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
import LoadingIcon from '../components/LoadingIcon';
import spotifyLogo from "../public/Spotify_Icon_RGB_White.png"
import Image from 'next/image'


//Google font
const sansita = Sansita_Swashed({
  subsets: ['latin'],
  variable: '--font-sansita',
  weight: '700',
  display: 'swap',
})


// Function to process lyrics into the format expected by WordCloud

const processLyricsToWords = (lyrics) => {
  if (!lyrics) return [];

  let doc = nlp(lyrics);
  let tokens = doc.terms().out('array');

  tokens = tokens.map(token => {
    // Normalize token
    token = token.toLowerCase().replace(/['’`]+$/, '');

    return token
  })
  .flatMap(token => token.split(/\s+/)) // Split tokens into words if they were concatenated
  .filter(token => /^[a-z'-]+$/i.test(token) && !token.match(/^['’`-]+$/));

  // console.log(tokens);
  const wordCounts = {};

  tokens.forEach(token => {
    if (!stopWords.has(token) && token.length > 2) {
      wordCounts[token] = (wordCounts[token] || 0) + 1;
    }
  });

  return Object.keys(wordCounts).map(word => ({
    text: word,
    value: wordCounts[word],
  }))
  .sort((a, b) => b.value - a.value).slice(0, 150);
};




const IndexPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [lyrics, setLyrics] = useState([]);
  const [error, setError] = useState(false); // New state for handling errors
  const [topTracks, setTopTracks] = useState([]);
  const [lyricsLoading, setLyricsLoading] = useState(false); // State to track loading of lyrics


  useEffect(() => {
    const fetchLyrics = async () => {
      if (session) {
        setLyricsLoading(true); // Start loading lyrics
        try {
          const tracks = await getTopTracks(session.accessToken);
          setTopTracks(tracks);
  
          const trackLyricsPromises = tracks.map(track =>
            getSongInfo(track.artists[0].name, track.name).catch(e => null)
          );
          const trackLyrics = await Promise.all(trackLyricsPromises);
  
          // Concatenate all lyrics into a single string
          const combinedLyrics = trackLyrics
            .filter(lyric => lyric != null)
            .join(' ');
  
          // Process the combined lyrics
          const allProcessedLyrics = processLyricsToWords(combinedLyrics);
          setLyricsLoading(false);
  
          if (JSON.stringify(allProcessedLyrics) !== JSON.stringify(lyrics)) {
            setLyrics(allProcessedLyrics); // Update the state with combined lyrics
          }
          setError(false);
        } catch (err) {
          setLyricsLoading(false);
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
    return  (
    <LoadingIcon loading={lyricsLoading}/>
    )
  }

  if (!session || error) { // Show sign-in button if not authenticated or if there's an error
    return (
        <div className="flex flex-col min-h-screen animated-background">
          <div className="flex-grow flex flex-col justify-center items-center p-4 overflow-hidden text-gray-700 dark:text-white">
            <h1 className={`${sansita.className}  text-5xl md:text-6xl lg:text-7xl mb-6 px-4 [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)] dark:[text-shadow:_6px_6px_0_rgb(0_0_0_/_40%)]`}>
              Lyric-Cloud
            </h1>
          <button
            onClick={() => signIn('spotify', { callbackUrl: '/' })}
            className='bg-mintgreen-400 hover:bg-emerald-500 text-white font-bold py-2 px-4 md:px-6 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mintgreen-300 my-4 mx-auto'
            aria-label="Sign in with Spotify"
>
            <Image src="/Spotify_Icon_RGB_White.png" alt="Spotify" width={24} height={24} className='inline-block mr-2'/>
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
{lyricsLoading ? (
      <LoadingIcon loading={lyricsLoading}/>
    ) : (
      <>
        <div className="flex justify-center">
          <WordCloud words={lyrics} />
        </div>
        <TopTracksList topTracks={topTracks} />
        <Footer />
      </>
    )}
    </div>


  );
};

export default IndexPage;
