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
        let scoreA = 0;
        let scoreB = 0;
        let scoreS = 0;

        data.forEach(({Origine,...others})=>{
            switch(Origine){
                case 'A':
                    fromA.push({...others});
                    let score = data.length - +others.Classement;
                    scoreA += (score )/(data.length )*6+1;
                    break;
                case 'B':
                    fromB.push({...others})
                    score = data.length - +others.Classement;
                    scoreB += (score )/(data.length )*6+1;
                    break;
                case 'S':
                    fromS.push({...others})
                    score = data.length - +others.Classement;
                    scoreS += (score )/(data.length )*6+1;
                    break;
            }
        })
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
         .on('mouseover',function (e,d){
            d3.select(this)
            
         })

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