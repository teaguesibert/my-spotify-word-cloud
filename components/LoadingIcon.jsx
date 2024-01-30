import React from "react";
import { ScaleLoader } from 'react-spinners';

const LoadingIcon = ({loading}) => {
    return (
    <div className="flex min-h-screen justify-center items-center">
        <ScaleLoader 
        size={50}
        color={"#95BDFF"} 
        loading={loading}
        />
    </div>  
  );
}
 
export default LoadingIcon;