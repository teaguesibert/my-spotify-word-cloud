import React from "react";

const TopTracksList = ({ topTracks }) => {
    return (
      <div className="container mx-auto p-4">
        <hr className="h-px my-8 dark:bg-gray-200 border-0 bg-gray-700"></hr>
        <h2 className="text-xl font-bold dark:text-white mb-4">Top Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="list-inside dark:text-gray-300">
            {topTracks.slice(0, Math.ceil(topTracks.length / 2)).map((track, index) => (
              <li key={index} className="mb-1 truncate hover:text-cyan-600 dark:hover:text-mintgreen-300 hover:scale-105">
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                </a>
              </li>
            ))}
          </ul>
          <ul className="list-inside dark:text-gray-300">
            {topTracks.slice(Math.ceil(topTracks.length / 2), topTracks.length).map((track, index) => (
              <li key={index} className="mb-1 truncate hover:text-cyan-600 dark:hover:text-mintgreen-300 hover:scale-105">
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