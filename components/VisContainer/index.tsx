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
        const padding = 20;
        const rectW = (width- padding*2)/3;
        const rectH =  height - padding*2;

        const svg = d3.select(containerRef.current).append('svg')
                    .attr('width',width)
                    .attr('height',height);
        const svgRadius = (Math.sqrt(Math.pow(width,2) + Math.pow(height,2)))/2;
        const schoolUnivCircle = Math.floor((svgRadius-70)/3 ) ;


        const sbaLeftPoint = {x:padding,y:padding}
        const sba = svg.append('g')
                    .attr('transform',`translate(${ rectW/2+padding},${rectH/2+padding})`)

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


        const algeiersLeftPoint = {x:padding + 2*rectW,y:padding}
        const algeirs = svg.append('g')
                        .attr('transform',`translate(${ width - rectW/2 -padding},${rectH/2+padding})`);
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

            const bejaiaLeftPoint = {x:padding+rectW,y:padding}
            const bejaia = svg.append('g')
            .attr('transform',`translate(${ width/2 },${height -rectH/2 - padding})`);
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

         //working with the dataset

         const centeralCirclePadding = 10;
        
        class Grid{
           
            private grid: (number | {x:number,y:number})[] = [];
            private rows:number;
            private cols:number;
            constructor(rows:number,cols:number){
                this.rows = rows;
                this.cols = cols;
                for(let i=0;i<this.rows*this.cols;i++){
                    this.grid[i] = -1;
                }

            }
            at(i:number,j:Number){
                if(i<0 || i>=this.rows || j<0 || j>=this.cols){
                      console.log(i,j,'indexes')
                    throw new Error("index out of bounds");
                }
                return this.grid[i*this.cols +this.rows]
            }
            set(i:number,j:Number,value:(number | {x:number,y:number})){
                if(i<0 || i>=this.rows || j<0 || j>=this.cols){

                    console.log(i,j,'indexes')
                    throw new Error(`index out of bounds i = ${i} j= ${j}`);
                }

                 this.grid[i*this.cols +this.rows] = value;
            }
            toString(){
                let s = '';
                for(let i=0;i<this.rows;i++){
                    for(let j=0;j<this.cols;j++){
                      
                        s += this.grid[i*cols +j]+ ' ';
                    }
                    s+=`
                    `;
                }
                return s;
            }
            count(){
                let c:number = 0;
               this.grid.forEach((el)=>{
                if(el !==-1) c++;
               })
               return c;
            }
            inBounds(i:number,j:number){
                if(i<0 || i>=this.rows || j<0 || j>=this.cols) return false;
                return true;
            }
        }
        const active:{x:number,y:number}[] = []
        function random(min:number,max:number,floor:boolean = true){
            let res =  Math.random()*(max-min)+min;
            if(floor) res = Math.floor(res);
            return res;
        }
        const r = 50;
        const k = 30;
        const w = r / Math.sqrt(2);
        
        const rows = Math.floor(rectH/w);
        const cols = Math.floor(rectW/w);
        const grid = new Grid(rows,cols)
        console.log(grid)
        
        let x = random(0,rectW)
        let y = random(0,rectH)

        const X0 = {x,y};

      
      
        grid.set(
            Math.floor(y/w),
            Math.floor(x/w),
            X0
        )
        active.push(X0);
        while(active.length >0){
            console.log('it')
            const randomIndex = Math.floor(Math.random()*active.length);
            const point = active[randomIndex];
            let found = false;
            console.log('base point: ',point)
            for(let t = 0;t<k;t++){
                
                let randomRadius = random(r,2*r);
                let randomAngle = random(0,Math.PI*2);
                let x = point.x + randomRadius*Math.cos(randomAngle);
                let y = point.y - randomRadius*Math.sin(randomAngle);
                let col =  Math.floor(x/w)
                let row = Math.floor(y/w)
              
            
                let neighborExist = false;
                if(grid.inBounds(row,col)){
                    
                    for(let i=-1;i<=1 && !neighborExist;i++){
                        for(let j=-1;j<=1 && !neighborExist;j++){
                          
                                    const neighbor = grid.at(row+i,col+j) as {x:number,y:number} ;
                                    //@ts-ignore
                                    if(grid.inBounds(row+i,col+j)&&neighbor != -1 ){
                                        const dist = Math.hypot(neighbor.x -x,neighbor.y - y);
                                        if(dist < r){
                                            neighborExist = true;
                                        }
            
                                    }
                            
    
    
                        }
                    }

                    if(!neighborExist){
                        console.log("set",grid.inBounds(row,col),row,col)
                        active.push({x,y});
                        grid.set(row,col,{x,y})
                        found = true;
                    }

                }
              
               

            }
            if(!found){
                 active.splice(randomIndex,1)
            }
        }

        console.log(grid.count(),active)



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