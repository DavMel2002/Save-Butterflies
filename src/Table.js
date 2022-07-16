import {useEffect, useState} from "react";
import Cell from "./Cell";
import btfImg from "./images/butterfly.webp";
function eachRow(innerObj,whole,func1,win,counter,countFlags){
    return (
        <div className="d-flex flex-row">
            {
                innerObj.map(obj =>
                    <Cell rowId={obj.rowId} colId={obj.colId} state={obj.state} grid={whole} func={func1} win={win} counter={counter} countFlags={countFlags}/>
                )
            }
        </div>
    )
}

function Table({arr,cong,lose,counter,countFlags,givenfunc}){
    const [helper,setHelper] = useState(0);
    const func = ()=>{ setHelper(helper===0?1:0); givenfunc();}

    let win = 1;
    const [was,setWas] = useState(0);
    for(let i = 0; i < arr.length && win; ++i)
        for(let j = 0; j < arr[0].length; ++j)
            if((arr[i][j].bombC === -1 && (arr[i][j].state===1 || arr[i][j].state === 3)) ||
                (arr[i][j].bombC!==-1 && arr[i][j].state!==1)){win = 0; break;}
    if(win===0){ //check if lost
        for(let i = 0; i < arr.length && win!==-1; ++i)
            for(let j = 0; j < arr[0].length; ++j)
                if(arr[i][j].state === 1 && arr[i][j].bombC===-1)
                {win=-1;break;}
    }
    if(was===1 || was===-1){
        let check = 1;
        for(let i = 0; i < arr.length && check; ++i)
            for(let j = 0; j < arr[0].length; ++j)
                if(arr[i][j].state!==0){check = 0; break;}
        if(check)setWas(0);
    }
    if(win===1){
        if(was===0) {
            cong();
            setWas(1);
        }
    } else if(win ===-1){
        if(was===0) {
            lose();
            setWas(-1);
        }
    }

    return (<>
            <div className="d-flex flex-row">
                <img src={btfImg} style={{width:"25px",height:"20px"}}/>
                <h4 style={{color:"green"}}>{counter - countFlags}</h4>
                <img src={btfImg} style={{width:"25px",height:"20px"}}/>
            </div>
        <div className=" border border-secondary border-3" onContextMenu={(e)=>{e.preventDefault()}}>
            {
                arr.map(obj =>
                    eachRow(obj,arr,func,win,counter,countFlags)
                )
            }
        </div>
        </>
    )
}

export default Table;
