import { CSSProperties, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './VisContainer.module.css';
import * as d3 from 'd3'
interface PropType{
    styles:CSSProperties;
}
const VisContainer = ({styles:s}:PropType)=>{
    const data = [];
    const [runOnce,setRunOnce] = useState(false);

  
    const containerRef = useRef(null);
    const getCircleStyle = ()=>{

    }
    useLayoutEffect(()=>{
        if(runOnce) return;
        const {width,height} = (containerRef.current as unknown as HTMLElement).getBoundingClientRect();
      
     

        const svg = d3.select(containerRef.current).append('svg')
                    .attr('width',width)
                    .attr('height',height);
        const svgRadius = (Math.sqrt(Math.pow(width,2) + Math.pow(height,2)))/2;
        const schoolUnivCircle = Math.floor(svgRadius*0.3) ;
        const padding = 20;
        const sba = svg.append('g')
                    .attr('transform',`translate(${ schoolUnivCircle+padding},${0+schoolUnivCircle+padding})`)
                    .append('circle')
                    .attr('r',schoolUnivCircle)
                    .attr('cx',0)
                    .attr('cy',0)
                    .attr('stroke','purple')
                    .attr('stroke-width','4')
                    .attr('fill','transparent')
        const algeirs = svg.append('g')
                        .attr('transform',`translate(${ width - schoolUnivCircle -padding},${schoolUnivCircle+padding})`)
                        .append('circle')
                        .attr('r',schoolUnivCircle)
                        .attr('cx',0)
                        .attr('cy',0)
                        .attr('stroke','purple')
                        .attr('stroke-width','4')
                        .attr('fill','transparent')

        const bejaia = svg.append('g')
        .attr('transform',`translate(${ width/2 },${height -schoolUnivCircle - padding})`)
        .append('circle')
        .attr('r',schoolUnivCircle)
        .attr('cx',0)
        .attr('cy',0)
        .attr('stroke','purple')
        .attr('stroke-width','4')
        .attr('fill','transparent')
                    
    
        
        console.log(width,height,runOnce)
       
        setRunOnce(true)


    return ()=>{
        d3.select(containerRef.current).select('svg').remove()
     }

    },[])

    return(
        <div ref={containerRef} className={styles.container} style={{
            width:s.width?s.width:'100%',
            height:s.height?s.height:'100%',
            ...s
        }}>
         
        </div>
    )
}
export default VisContainer;