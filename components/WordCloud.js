// components/CustomWordCloud.js
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { useTheme } from 'next-themes';

const WordCloud = ({ words }) => {
  const ref = useRef();
  const [size, setSize] = useState([800, 400]); // Default size
  console.log(words)
  const { theme } = useTheme();
  const [colorScheme, setColorScheme] = useState([]);

  useEffect(() => {
    const updateSize = () => {
      // Update the size to window width while maintaining aspect ratio
      const width = window.innerWidth;
      let height;
  
      // Check if we're on a mobile device based on the width
      if (width <= 768) { // 768px is a common breakpoint for mobile devices
        height = width; // 1:1 aspect ratio for mobile
      } else {
        height = width * 0.5; // Maintain a 2:1 aspect ratio for wider screens
      }
  
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
    const lightColors = ["#f78fa7", "#7fc6e8", "#8ddfb3", "#f8b195", "#9a9ede", "#fbc6a4"];
    const darkColors = ["#dc143c", "#50c878", "#4169e1", "#9c51b6", "#ffd700", "#40e0d0"];
    setColorScheme((theme === 'dark' ? darkColors : lightColors));

   /*  const customColors = ["#66a5ad", "#92c5de", "#b8a398", "#800020", "#cc5500", "#d4af37", "#c8a2c8", "#967bb6"];
    const colorSchemeLight = d3.scaleOrdinal(["#f78fa7", "#7fc6e8", "#8ddfb3", "#f8b195", "#9a9ede", "#fbc6a4"]);
    const colorSchemeDark = d3.scaleOrdinal(["#dc143c", "#50c878", "#4169e1", "#9c51b6", "#ffd700", "#40e0d0"]); */

    const color = d3.scaleOrdinal(colorScheme)
    const fontSizeScale = d3.scaleSqrt()
      .domain(d3.extent(words, d => d.value))
      .range([6, 100]);

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

  return <svg ref={ref} width={size[0]} height={size[1]}/>;
};

export default WordCloud;
