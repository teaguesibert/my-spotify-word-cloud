import React from "react"
import ThemeButton from "../ThemeButton/ThemeButton"
import "./footer.css"

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#828282"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
);

const Footer = () => {
return <>
<footer className="w-full py-2  bg-transparent">
    <div className="flex justify-between items-center mx-auto px-4">
        <div className="dark:text-white text-md ">Teague</div>
         {/* Info Icon */}
         <span className="info-icon group ">
          <InfoIcon/>
            {/* Tooltip */}
            <span className="tooltip p-2">This app uses the most frequently found words from your top 20 Spotify tracks to generate a word cloud!</span>
          </span>
          
        <ThemeButton />
    </div>
</footer>
</>
}

export {Footer}