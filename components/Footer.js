import React from "react"
import ThemeButton from "./ThemeButton"

const Footer = () => {
return <>
<footer className="w-full py-2  bg-transparent">
    <div className="flex justify-between items-center mx-auto px-4">
        <div className="dark:text-white text-md ">Teague Sibert</div>
        <ThemeButton />
    </div>
</footer>
</>
}

export {Footer}