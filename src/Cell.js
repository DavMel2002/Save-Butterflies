import {Button} from "react-bootstrap";
import bgImage from "./images/butterfly.webp";
import thxImage from "./images/thx.png"
import cryImage from "./images/cry.png";
function Cell({state,rowId,colId,grid,func,win,counter,countFlags}){
    const myStyle = {
        width: "20px",
        height: "20px",
        borderRadius: "0px",
        backgroundColor: "#73b6c9",
        boxShadow: "none"
    }
    const myStyle2 =  {
        width: "20px",
        height: "20px",
        borderRadius: "0px",
        backgroundColor: "#9bcfde",
        boxShadow: "none"
    };

    function display() {

        const colourful = [];
        colourful[0] = "#00a0f0";
        colourful[1] = "#00a0f0";
        colourful[2] = "#176b06";
        colourful[3] = "#ff3333";
        colourful[4] = "#317864";
        colourful[5] = "#641fbf";
        colourful[6] = "#f00af0";
        colourful[7] = "#8a1125";
        colourful[8] = "#25324a";
        if(win===1){
            return (
                <>
                {
                    grid[rowId][colId].bombC === -1 ?
                        <Button className="border border-primary border-1 p-0 " style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "0px",
                            backgroundColor: "#acde9b",
                            boxShadow: "none",
                            backgroundImage: `url(${thxImage})`,
                            backgroundSize: "90% 90%",
                            backgroundPosition:"center",
                            cursor: 'default',
                            backgroundRepeat:'no-repeat'
                        }}/> :
                        <Button className="border border-primary border-1 p-0 " style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "0px",
                            backgroundColor: "#acde9b",
                            color: colourful[grid[rowId][colId].bombC],
                            boxShadow: "none",
                            cursor: 'default'
                        }}>{grid[rowId][colId].bombC !== 0 ? grid[rowId][colId].bombC : <></>}</Button>
                }
                </>
            )
        } else if(win ===-1) {
            return (
                <>
                    {
                        grid[rowId][colId].bombC === -1 ?
                            <Button className="border border-primary border-1 p-0 " style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "0px",
                                backgroundColor: "#a10808",
                                boxShadow: "none",
                                backgroundImage: `url(${cryImage})`,
                                backgroundSize: "90% 90%",
                                backgroundPosition:"center",
                                cursor: 'default',
                                backgroundRepeat:'no-repeat'
                            }}/> :
                            <Button className="border border-primary border-1 p-0 " style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "0px",
                                backgroundColor: "#e7b944",
                                color: colourful[grid[rowId][colId].bombC],
                                boxShadow: "none",
                                cursor: 'default'
                            }}>{grid[rowId][colId].bombC !== 0 ? grid[rowId][colId].bombC : <></>}</Button>
                    }
                </>
            )
        } else
        return (<>
            <Button className="border border-primary border-1 p-0 " style={{
                width: "20px",
                height: "20px",
                borderRadius: "0px",
                backgroundColor: "#acde9b",//acde9b
                color: colourful[grid[rowId][colId].bombC],
                boxShadow: "none",
                cursor: 'default'
            }}>{grid[rowId][colId].bombC !== 0 ? grid[rowId][colId].bombC : <></>}</Button>
        </>)
    }

    const doThis = (curRowId,curColId)=>{
        if(curRowId>=0 && curRowId < grid.length && curColId>=0 && curColId < grid[0].length && (grid[curRowId][curColId].state===0 || grid[curRowId][curColId].state===2)) {
            grid[curRowId][curColId].state = 1;
            if (grid[curRowId][curColId].bombC === 0) {
                doThis(curRowId, curColId + 1);
                doThis(curRowId, curColId - 1);
                doThis(curRowId + 1, curColId - 1);
                doThis(curRowId + 1, curColId);
                doThis(curRowId + 1, curColId + 1);
                doThis(curRowId - 1, curColId - 1);
                doThis(curRowId - 1, curColId);
                doThis(curRowId - 1, curColId + 1);
            }
            func();
        }
    }
    const callDoThis = (e)=>{
        if(e.type === "contextmenu"){
            if(counter>countFlags) {
                grid[rowId][colId].state = 2;
                func();
            }
        }
        else {
            doThis(rowId,colId);
        }
    }
    const getBack = ()=>{
        grid[rowId][colId].state = 0;
        func();
    }
    return (
        <>
            {(win===1 || win===-1)?display(): (state === 0) ? <> {
                ((rowId + colId) % 2 === 1) ? <Button className="border border-primary border-1 p-0 "
                                                                    style={myStyle} onClick={callDoThis} onContextMenu={callDoThis}></Button>
                : <Button className="border border-primary border-1 p-0 " style={myStyle2}onClick={callDoThis} onContextMenu={callDoThis}></Button>
            } </>
                :<>
                {
                    (state===1) ? display() :
                        <Button className="border border-primary border-1 p-0 " style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "0px",
                            backgroundColor: "#b585de",
                            boxShadow: "none",
                            backgroundImage: `url(${bgImage})`,
                            backgroundSize: "90% 90%",
                            backgroundPosition:"center",
                            backgroundRepeat:'no-repeat',
                        }} onClick={getBack} onContextMenu={getBack}
                        >
                        </Button>
                }
                </>
            }
        </>
    )
}

export default Cell;