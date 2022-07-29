import { useEffect, useRef } from 'react';
import styles from './Viscontainer.module.css';

const VisContainer = ()=>{
    const data = [];
    const svgRef = useRef(null);
    useEffect(()=>{
        console.log(svgRef)
    },[])
    return(
        <div className={styles.container}>
            <svg ref={svgRef}>

            </svg>
        </div>
    )
}
export default VisContainer;