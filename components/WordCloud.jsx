// components/CustomWordCloud.js
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { useTheme } from 'next-themes';
import { saveAs } from 'file-saver';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#828282"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
)

const WordCloud = ({ words }) => {
  const ref = useRef();
  const [size, setSize] = useState([800, 400]); // Default size
  console.log(words)
  const { theme } = useTheme();
  const [colorScheme, setColorScheme] = useState([]);

  useEffect(() => {
    const updateSize = () => {
      // Get the full width and height of the window
      let width = window.innerWidth;
      let height = window.innerHeight;
    
      // Set a maximum size for larger screens
      const maxWidth = 992; 
      const maxHeight = 600; 
    
      if (width > maxWidth) {
        width = maxWidth;
        height = maxHeight; // Keep a fixed height or adjust based on aspect ratio
      }
    
      // Set the SVG size
      setSize([width, height]);
    };
  
    // Set up the event listener for resizing
    window.addEventListener('resize', updateSize);
    
    // Call the function to set the initial size
    updateSize();
    
    // Remove the event listener on cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  


  useEffect(() => {
    if (!words || !Array.isArray(words)) {
      console.error('Invalid or missing words prop');
      return;
    }
    const lightColors = ["#dc143c", "#50c878", "#4169e1", "#9c51b6", "#ffd700", "#40e0d0"];
    const darkColors = ["#f78fa7", "#7fc6e8", "#8ddfb3", "#f8b195", "#9a9ede", "#fbc6a4"];
    setColorScheme((theme === 'dark' ? darkColors : lightColors));

    const color = d3.scaleOrdinal(colorScheme)
    const fontSizeScale = d3.scaleSqrt()
      .domain(d3.extent(words, d => d.value))
      .range([3, 100]);

    const layout = cloud()
      .size(size)
      .words(words.map(d => ({ text: d.text, size: fontSizeScale(d.value) })))
      .padding(5)
      .rotate(() => Math.random() > 0.5 ? 0 : 90)
      .font('Sans-serif')
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words) {
      d3.select(ref.current).selectAll('*').remove(); // Clear the SVG on every draw

      const svg = d3.select(ref.current)
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

      svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Sans-serif')
        .style('fill', (d, i) => color(i))
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [theme, words,size]);
  

  const downloadImage = async () => {
    const svg = ref.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;
    const ctx = canvas.getContext('2d');
   // Scale the context to counteract the increased canvas size

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        saveAs(blob, 'word-cloud.png', { quality: 1 });
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };


  return (
  <div className="flex flex-col items-center">
    <svg ref={ref} width={size[0]} height={size[1]}/>
    <span className="hover:cursor-pointer" onClick={downloadImage}>
      <DownloadIcon/>
    </span>
  </div> 
  )
};

export default WordCloud;
