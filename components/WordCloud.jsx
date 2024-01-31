// components/CustomWordCloud.js
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { useTheme } from 'next-themes';
import { saveAs } from 'file-saver';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill="#828282"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
)
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill="#828282"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
)

const WordCloud = ({ words }) => {
  const ref = useRef();
  const [size, setSize] = useState([800, 400]); // Default size
  console.log(words)
  const { theme } = useTheme();
  const [colorScheme, setColorScheme] = useState([]);

  const updateSize = () => {
    // Get the full width and height of the window
    let width = window.innerWidth - 20;
    let height = window.innerHeight - 20;
  
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


  useEffect(() => {
    // Call the function to set the initial size
    updateSize();
    
    return 
  }, []);
  


  useEffect(() => {
    if (!words || !Array.isArray(words)) {
      console.error('Invalid or missing words prop');
      return;
    }
    const lightColors = ["#FC8DCA", "#C37EDB", "#B7A6F6", "#88A3E2", ];
    const darkColors = ["#FFCFEA", "#FEFFBE", "#CBFFE6", "#AFE9FF", "#BFB9FF",];
    setColorScheme((theme === 'dark' ? darkColors : lightColors));

    const color = d3.scaleOrdinal(colorScheme)
    const fontSizeScale = d3.scaleSqrt()
      .domain(d3.extent(words, d => d.value))
      .range([8, 120]);

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
  }, [theme, words, size]);
  

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
  <div className="flex flex-col items-center p-1">
    <svg className="" ref={ref} width={size[0]} height={size[1]}/>
    <div className='flex justify-between pt-5'>
      <span className="hover:cursor-pointer  mx-4" onClick={downloadImage}>
        <DownloadIcon/>
      </span>
      <span className="hover:cursor-pointer mx-4" onClick={updateSize}>
        <RefreshIcon/>
      </span>
    </div>
  </div> 
  )
};

export default WordCloud;