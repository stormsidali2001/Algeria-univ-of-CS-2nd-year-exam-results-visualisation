import { CSSProperties, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './VisContainer.module.css';
import * as d3 from 'd3';
import {data} from '../../data'
interface PropType{
    styles:CSSProperties;
}
const VisContainer = ({styles:s}:PropType)=>{

    const [runOnce,setRunOnce] = useState(false);

  
    const containerRef = useRef(null);
   
    useLayoutEffect(()=>{
        const fromA: { Classement: string; Affectation: string; }[] = [];
        const fromB: { Classement: string; Affectation: string; }[] = [];
        const fromS: { Classement: string; Affectation: string; }[] = [];
        data.forEach(({Origine,...others})=>{
            switch(Origine){
                case 'A':
                    fromA.push({...others})
                    break;
                case 'B':
                    fromB.push({...others})
                    break;
                case 'S':
                    fromS.push({...others})
                    break;
            }
        })  
        if(runOnce) return;
        const {width,height} = (containerRef.current as unknown as HTMLElement).getBoundingClientRect();
      
     

        const svg = d3.select(containerRef.current).append('svg')
                    .attr('width',width)
                    .attr('height',height);
        const svgRadius = (Math.sqrt(Math.pow(width,2) + Math.pow(height,2)))/2;
        const schoolUnivCircle = Math.floor((svgRadius-70)/3 ) ;
        const padding = 20;

        const sba = svg.append('g')
                    .attr('transform',`translate(${ schoolUnivCircle+padding},${0+schoolUnivCircle+padding})`)
                    
               sba
               .append('circle')
               .attr('r',schoolUnivCircle)
               .attr('cx',0)
               .attr('cy',0)
               .attr('stroke','black')
               .attr('stroke-width','4')
               .attr('fill','transparent')

                sba
                .append("circle")
                .attr("r", 30)
                .attr("cx",0)
                .attr("cy",0)
                .attr("fill","black")

                sba.append('text')
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".35em")
                .attr('stroke',"white")
                .attr("font-size", "14")
                .attr("text-anchor", "middle")
                .text('Sba')
               

        const algeirs = svg.append('g')
                        .attr('transform',`translate(${ width - schoolUnivCircle -padding},${schoolUnivCircle+padding})`);
            algeirs
            .append('circle')
            .attr('r',schoolUnivCircle)
            .attr('cx',0)
            .attr('cy',0)
            .attr('stroke','black')
            .attr('stroke-width','4')
            .attr('fill','transparent')

            algeirs
            .append("circle")
            .attr("r", 30)
            .attr("cx",0)
            .attr("cy",0)
            .attr("fill","black")

            algeirs
            .append('text')
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr('stroke',"white")
            .attr("font-size", "12")
            .attr("text-anchor", "middle")
            .text('Algeirs')

            const bejaia = svg.append('g')
            .attr('transform',`translate(${ width/2 },${height -schoolUnivCircle - padding})`);
            bejaia
            .append('circle')
            .attr('r',schoolUnivCircle)
            .attr('cx',0)
            .attr('cy',0)
            .attr('stroke','black')
            .attr('stroke-width','4')
            .attr('fill','transparent')

            bejaia
            .append("circle")
            .attr("r", 30)
            .attr("cx",0)
            .attr("cy",0)
            .attr("fill","black")

            bejaia
            .append('text')
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr('stroke',"white")
            .attr("font-size", "12")
            .attr("text-anchor", "middle")
            .text('Bejaia')
                    
         //working with the dataset
         const randoms: { r: number;theta:number }[] = [];
         const circles: {x:number,y:number,r:number}[] = []
         const centeralCirclePadding = 10;

         const randomCircle = ()=>{
            const radialCoord:any = {
                r:30+centeralCirclePadding+Math.floor(Math.random()*(schoolUnivCircle-30-centeralCirclePadding)),
                theta:Math.random()*2*Math.PI
             };
            const x = radialCoord.r*Math.cos(radialCoord.theta);
            const y = -radialCoord.r*Math.sin(radialCoord.theta);
            circles.forEach(c=>{
                
                const dxPow = Math.pow( x -c.x,2) 
                const dyPow = Math.pow( y -c.y,2) 
                const distance = Math.sqrt(dxPow + dyPow);
                if(distance < c.r +radialCoord.r){
                    randomCircle();
                
                }
                
            })
            const circle = {
                x,
                y,
                r:radialCoord.r
            }
            circles.push(circle)
       
           
    }
        fromS.forEach(_=>{
            randomCircle()
        })
        console.log(circles)

        //  sba.selectAll('data-sba-circle').data(fromS)
        //  .enter()
        //  .append("circle")
        //  .attr("class","data-sba-circle")
        //  .attr("r", d=>{
        //     const score = data.length - +d.Classement;
        //     return (score )/(data.length )*4+2;
        //  })
        //  .attr("cx",(_,i)=>{
         
          
           
        //     return circles[i].x
        // })
        //  .attr("cy",(_,i)=>{
        //     return circles[i].y
        // })
        //  .attr("fill","transparent")
        //  .attr('stroke','black')
        
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