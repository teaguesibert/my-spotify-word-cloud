import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";


const TopTracksList = ({ topTracks }) => {
  const { theme } = useTheme();

  const logoSrc = theme === 'dark' ? "/Spotify_Icon_RGB_White.png" : "/Spotify_Icon_RGB_Black.png";

    return (
      <div className="container mx-auto p-4">
        <hr className="h-px mt-8 mb-10 dark:bg-gray-200 border-0 bg-gray-700"></hr>
        <div className="flex items-center pl-1 pb-8">
          <Image src={logoSrc} alt="Spotify" width={30} height={30} className='inline-block mr-2'/>
          <h2 className="text-xl font-bold dark:text-spotify-100 text-spotify-200 mb-0">Top Tracks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
          <ul className="list-inside font-medium text-spotify-200 dark:text-spotify-100 ml-2">
            {topTracks.slice(0, Math.ceil(topTracks.length / 2)).map((track, index) => (
              <li key={index} className=" truncate hover:text-cyan-600 dark:hover:text-mintgreen-300 hover:scale-105">
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                </a>
              </li>
            ))}
          </ul>
          <ul className="list-inside font-medium text-spotify-200 dark:text-spotify-100 ml-2">
            {topTracks.slice(Math.ceil(topTracks.length / 2), topTracks.length).map((track, index) => (
              <li key={index} className=" truncate hover:text-cyan-600 dark:hover:text-mintgreen-300 hover:scale-105">
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
export default TopTracksList;