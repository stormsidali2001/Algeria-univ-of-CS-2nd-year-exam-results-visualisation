import { CSSProperties, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import styles from './VisContainer.module.css';
import * as d3 from 'd3';
import {data} from '../../data'
//@ts-ignore
import * as uniqid from 'uniqid'
interface PropType{
    styles:CSSProperties;
}

const VisContainer = ({styles:s}:PropType)=>{
    

    const [runOnce,setRunOnce] = useState(false);


    const containerRef = useRef(null);

    useLayoutEffect(()=>{
        function handleMouseOver(e:any,d: { Classement: string | number; }){
            //e.path contains all the ancestors
            const parent = d3.select(e.path[1]);
            console.log(e.path[1])
            const target = d3.select(e.path[0])
            const score = data.length - +d.Classement;
            parent
            .append('g')
            .classed('removeableText', true)
            .attr("transform",`translate(${+target.attr('cx')},${+target.attr('cy')-+target.attr('r')})`)
            .append('rect')
            .attr('fill',"black")
            .attr('width',80)
            .attr('height',20)
            .attr('x',-80/2)
            .attr('y',-20/2-10)
            
            parent.select('g')
            .append('text')
            .attr("x", 0)
            .attr("y",-10)
            .attr("dy", ".35em")
            .attr('stroke',"white")
            .attr("font-size", "13")
            .attr("text-anchor", "middle")
            .text('score: '+score)
            


         }
         function handleMouseLeave(e: { path: any[]; }) {
            console.log('leave', e.path[1])
            const parent = e.path[1];

             d3.select(parent).selectAll('.removeableText').remove()
          }
       
        const fromA: { Classement: string; Affectation: string; }[] = [];
        const fromB: { Classement: string; Affectation: string; }[] = [];
        const fromS: { Classement: string; Affectation: string; }[] = [];
        let scoreA = 0;
        let scoreB = 0;
        let scoreS = 0;
        //from university to another one
        let A_B = 0;
        let A_S = 0;

        let B_A = 0;
        let B_S = 0;

        let S_A = 0;
        let S_B = 0;

        data.forEach(({Origine,...others})=>{
            switch(Origine){
                case 'A':
                    fromA.push({...others});
                    let score = data.length - +others.Classement;
                    scoreA += score;
                    if(others.Affectation === 'B') A_B++;
                    else  if(others.Affectation === 'S') A_S++;
                    break;
                case 'B':
                    fromB.push({...others})
                    score = data.length - +others.Classement;
                    scoreB += score;
                    if(others.Affectation === 'A') B_A++;
                    else  if(others.Affectation === 'S') B_S++;
                    break;
                case 'S':
                    fromS.push({...others})
                    score = data.length - +others.Classement;
                    scoreS += score;
                    if(others.Affectation === 'B') S_B++;
                    else  if(others.Affectation === 'A') S_A++;
                    
                    break;
            }
        })
        scoreA = scoreA / fromA.length;
        scoreS = scoreS / fromS.length;
        scoreB = scoreB / fromB.length;
        console.log(`scoreS: ${scoreS} scoreB: ${scoreB} scoreA: ${scoreA}`)


        if(runOnce) return;
        const {width,height} = (containerRef.current as unknown as HTMLElement).getBoundingClientRect();
        const padding = 20;
        const rectW = (width)/3;
        const rectH =  height ;

        const svg = d3.select(containerRef.current).append('svg')
                    .attr('width',width)
                    .attr('height',height);


        const sba = svg.append('g')
                    .attr('transform',`translate(${ rectW/2},${rectH/2})`)

               sba
               .append('rect')
               .attr('width',rectW)
               .attr('height',rectH)
               .attr('transform',`translate(${-rectW/2},${-rectH/2})`)
               .attr('x',0)
               .attr('y',0)
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

                sba
                .append('text')
                .attr("x", 0)
                .attr("y", -rectH/2+20)
                .attr("dy", ".35em")
                .attr('stroke',"black")
                .attr("font-size", "14")
                .attr("text-anchor", "middle")
                .text('Score: '+Math.floor(scoreS))


        const algeirs = svg.append('g')
                        .attr('transform',`translate(${ width - rectW/2 },${rectH/2})`);
            algeirs
            .append('rect')
            .attr('width',rectW)
            .attr('height',rectH)
            .attr('transform',`translate(${-rectW/2},${-rectH/2})`)
            .attr('x',0)
            .attr('y',0)
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

            algeirs
            .append('text')
            .attr("x", 0)
            .attr("y", -rectH/2+20)
            .attr("dy", ".35em")
            .attr('stroke',"black")
            .attr("font-size", "14")
            .attr("text-anchor", "middle")
            .text('Score: '+Math.floor(scoreA))

            const bejaia = svg.append('g')
            .attr('transform',`translate(${ width/2 },${height -rectH/2 })`);
            bejaia
            .append('rect')
            .attr('width',rectW)
            .attr('height',rectH)
            .attr('transform',`translate(${-rectW/2},${-rectH/2})`)
            .attr('x',0)
            .attr('y',0)
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

            bejaia
            .append('text')
            .attr("x", 0)
            .attr("y", -rectH/2+20)
            .attr("dy", ".35em")
            .attr('stroke',"black")
            .attr("font-size", "14")
            .attr("text-anchor", "middle")
            .text('Score: '+Math.floor(scoreB))


         //working with the dataset

        
    
        const active:{x:number,y:number}[] = []
        function random(min:number,max:number,floor:boolean = true){
            let res =  Math.random()*(max-min)+min;
            if(floor) res = Math.floor(res);
            return res;
        }
        const r = 17;
        const k = 30;
        const w = r / Math.sqrt(2);
        
        const rows = Math.floor((rectH-70)/w);
        const cols = Math.floor((rectW-70)/w);
        const grid:({x:number,y:number} |undefined)[] = []
        for(let i = 0;i<rows*cols;i++){
            grid[i] = undefined;
        }
        let x = rectW/2
        let y = rectH/2
        const col = Math.floor(y/w);
        const row =  Math.floor(x/w);

        const X0 = {x,y};

      
        grid[row*cols +col] = X0;
        active.push(X0);
        while(active.length >0){
            const randomIndex = Math.floor(Math.random()*active.length);
            const point = active[randomIndex];
            let found = false;
            for(let t = 0;t<k;t++){
                
                let randomRadius = random(r,2*r);
                let randomAngle = random(0,Math.PI*2);
                const sample = {
                    x:point.x + randomRadius*Math.cos(randomAngle),
                    y:point.y - randomRadius*Math.sin(randomAngle)
                };
                let col =  Math.floor(sample.x/w)
                let row = Math.floor(sample.y/w)
                
            
                const dist = (obj1:{x:number,y:number},obj2:{x:number,y:number})=>{
                    return Math.hypot(obj1.x-obj2.x,obj1.y-obj2.y)
                }
                if (col > -3 && row > -3 && col < cols && row < rows && !grid[row*cols +col]) {
                        var neighborExist = false;
                        for (var i = -3; i <= 3; i++) {
                            for (var j = -3; j <= 3; j++) {
                                    var neighbor = grid[(row+j)*cols +col+i];
                                    if (neighbor) {
                                        var d = dist(sample, neighbor);
                                        if (d < r) {
                                            neighborExist = true;
                                        }
                                    }
                            }
                        }
                        if (!neighborExist) {
                            found = true;
                            grid[row*cols +col] = sample
                         
                            active.push(sample);
                            break;
                          }
               
                }
            }
        
            if(!found){
                 active.splice(randomIndex,1)
            }
        }

    

        let filledGrid = grid.filter(el=>el)
        filledGrid = filledGrid.sort((a,b)=>Math.random()-0.5)
        console.log(filledGrid,filledGrid.length,fromS.length)

         sba.selectAll('data-sba-circle').data(fromS)
         .enter()
         .append("circle")
         .attr("class","data-sba-circle")
         .attr("r", d=>{
            const score = data.length - +d.Classement;
            return (score )/(data.length )*6+2;
        })
        //@ts-ignore
         .attr("cx",(_,i)=>{
        //@ts-ignore
            return 40 +filledGrid[i]?.x -rectW/2
        })
        //@ts-ignore
         .attr("cy",(_,i)=>{

            //@ts-ignore
            return 40+  filledGrid[i]?.y  -rectH/2
        })
        .attr("fill",d=>{
            const score = data.length - +d.Classement;
            const ratio =  (score )/(data.length );
            let color;
            if(ratio < 0.25){
                color = 'green';
            }
            else if(ratio <0.75){
                color = 'yellow';
            }
            else{
                color = 'red';
            }
            return color;
         })
         .attr('stroke','black')
         .on('mouseover',handleMouseOver)
         .on('mouseleave', handleMouseLeave)



         filledGrid = filledGrid.sort((a,b)=>Math.random()-0.5)
         algeirs.selectAll('data-algeirs-circle').data(fromA)
         .enter()
         .append("circle")
         .attr("class","data-algeirs-circle")
         .attr("r", d=>{
            const score = data.length - +d.Classement;
            return (score )/(data.length )*6+2;
        })
        //@ts-ignore
         .attr("cx",(_,i)=>{
        //@ts-ignore
            return 40+ filledGrid[i]?.x -rectW/2
        })
        //@ts-ignore
         .attr("cy",(_,i)=>{

            //@ts-ignore
            return  40+ filledGrid[i]?.y  -rectH/2
        })
        .attr("fill",d=>{
            const score = data.length - +d.Classement;
            const ratio =  (score )/(data.length );
            let color;
            if(ratio < 0.25){
                color = 'green';
            }
            else if(ratio <0.75){
                color = 'yellow';
            }
            else{
                color = 'red';
            }
            return color;
         })
         .attr('stroke','black')
         .on('mouseover',handleMouseOver)
         .on('mouseleave', handleMouseLeave)

         filledGrid = filledGrid.sort((a,b)=>Math.random()-0.5)
        

         bejaia.selectAll('data-bejaia-circle').data(fromB)
         .enter()
         .append("circle")
         .attr("class","data-bejaia-circle")
         .attr("r", d=>{
            const score = data.length - +d.Classement;
            return (score )/(data.length )*6+2;
        })
        //@ts-ignore
         .attr("cx",(_,i)=>{
        //@ts-ignore
            return 40+ filledGrid[i]?.x -rectW/2
        })
        //@ts-ignore
         .attr("cy",(_,i)=>{

            //@ts-ignore
            return  40+ filledGrid[i]?.y  -rectH/2
        })
        
         .attr("fill",d=>{
            const score = data.length - +d.Classement;
            const ratio =  (score )/(data.length );
            let color;
            if(ratio < 0.25){
                color = 'green';
            }
            else if(ratio <0.75){
                color = 'yellow';
            }
            else{
                color = 'red';
            }
            return color;
         })
         .attr('stroke','black')
         .on('mouseover',handleMouseOver)
         .on('mouseleave', handleMouseLeave)
        

        console.log(width,height,runOnce)



        //fleches d'affectation
        function drawArrow(
            svg:d3.Selection<SVGSVGElement, unknown, null,undefined>,
             {x,y,placement}:{x:number,y:number,placement:'start'|'end'}
             ){
            const arrowId = 'arrow'+uniqid()
            const arrowContainer = svg.append('g')
            arrowContainer
            .attr("transform",`translate(${x},${y})`)

            let line = arrowContainer.append("line")
            .attr("x1",20)  
            .attr("y1",0)  
            .attr("x2",-20)  
            .attr("y2",0)  
            .attr("stroke","black")  
            .attr("stroke-width",5)  
            if(placement === 'start') line.attr("marker-start",`url(#${arrowId})`); 
            else if(placement === 'end') line.attr("marker-end",`url(#${arrowId})`); 

            
            
             arrowContainer.append("svg:defs")
             const marker  = arrowContainer.append("svg:marker")
             .attr("id", arrowId)
             .attr("viewBox", "0 -5 10 10")
             .attr('refX', 0) // distance from the head of the arrow in the x-axis]
             .attr('refY', 0)
             .attr("markerWidth", 4)
             .attr("markerHeight", 4)
             marker.append("svg:path")
             .attr("d", "M0,-5L10,0L0,5");

             if(placement === 'start') marker.attr("orient",'0deg'); 
             else if(placement === 'end') marker.attr("orient",'180deg'); 
 

             return arrowContainer


        
          

        }
        const arrow1 = drawArrow(svg,{x:rectW,y:20,placement:'end'})
        const arrow2 = drawArrow(svg,{x:rectW,y:rectH-20,placement:'start'})
        const arrow3 = drawArrow(svg,{x:rectW*2,y:20,placement:'end'})
        const arrow4 = drawArrow(svg,{x:rectW*2,y:rectH-20,placement:'start'})
         arrow1
        .append('g')
        .append('circle')
        .attr('fill',"black")
        .attr('r',10)
       
        .attr('cx',0)
        .attr('cy',0)
        
        arrow1.select('g')
        .append('text')
        .attr("x", 0)
        .attr("y",0)
        .attr("dy", ".35em")
        .attr('stroke',"white")
        .attr("font-size", "13")
        .attr("text-anchor", "middle")
        .text(B_S)

        arrow2
        .append('g')
        .append('circle')
        .attr('fill',"black")
        .attr('r',10)
       
        .attr('cx',0)
        .attr('cy',0)
        
        arrow2.select('g')
        .append('text')
        .attr("x", 0)
        .attr("y",0)
        .attr("dy", ".35em")
        .attr('stroke',"white")
        .attr("font-size", "13")
        .attr("text-anchor", "middle")
        .text(S_B)

        arrow3
        .append('g')
        .append('circle')
        .attr('fill',"black")
        .attr('r',10)
       
        .attr('cx',0)
        .attr('cy',0)
        
        arrow3.select('g')
        .append('text')
        .attr("x", 0)
        .attr("y",0)
        .attr("dy", ".35em")
        .attr('stroke',"white")
        .attr("font-size", "13")
        .attr("text-anchor", "middle")
        .text(A_B)

        arrow4
        .append('g')
        .append('circle')
        .attr('fill',"black")
        .attr('r',10)
       
        .attr('cx',0)
        .attr('cy',0)
        
        arrow4.select('g')
        .append('text')
        .attr("x", 0)
        .attr("y",0)
        .attr("dy", ".35em")
        .attr('stroke',"white")
        .attr("font-size", "13")
        .attr("text-anchor", "middle")
        .text(B_A)
      
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

