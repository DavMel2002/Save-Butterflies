import Table from "./Table";
import {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import btfImg from "./images/butterfly.webp";
import cryImg from "./images/cry.png";

function generate(row,col,bombCount){
    const array = [];
    for (let i = 0; i < row; i++) {
        array[i]=[];
        for(let j = 0;j < col;++j)
            array[i][j] =
                {
                    state:0,
                    rowId:i,
                    colId:j,
                    bombC:0
                }
    }
    for(let i = 0; i < row*col*(bombCount/100); ++i) {
        let x = Math.floor(Math.random()*row*col + 1)-1;
        array[Math.floor(x/col)][x%col].bombC = -1;
    }
    for(let i=0;i<row;++i)
        for(let j=0;j<col;++j) {
            if(array[i][j].bombC!==-1){
                if(i)
                    array[i][j].bombC+=(array[i-1][j].bombC===-1);
                if(i && j+1<col)
                    array[i][j].bombC+=(array[i-1][j+1].bombC===-1);
                if(i && j)
                    array[i][j].bombC+=(array[i-1][j-1].bombC===-1);
                if(j+1<col)
                    array[i][j].bombC+=(array[i][j+1].bombC===-1);
                if(j)
                    array[i][j].bombC+=(array[i][j-1].bombC===-1);
                if(i+1<row)
                    array[i][j].bombC+=(array[i+1][j].bombC===-1);
                if(i+1<row && j+1 < col)
                    array[i][j].bombC+=(array[i+1][j+1].bombC===-1);
                if(i+1 < row && j)
                    array[i][j].bombC+=(array[i+1][j-1].bombC===-1);
            }
        }
    return array;
}
function countBombs(arr){
    let cnt = 0;
    const row = arr.length, col = arr[0].length;
    for(let i=0;i<row;++i)
        for(let j=0;j<col;++j)
            if(arr[i][j].bombC===-1)cnt++;
    return cnt;
}

function counterFlags(arr){
    let cnt = 0;
    const row = arr.length, col = arr[0].length;
    for(let i=0;i<row;++i)
        for(let j=0;j<col;++j)
            if(arr[i][j].state===2)cnt++;
    return cnt;
}

const initialInput = {
    row: 20,
    col: 12,
    bombPercentage: 10
}

function App() {
    const data = window.localStorage.getItem("MyValues");
    const modData =JSON.parse(data);
    const [formValues,setFormValues] = useState((modData===undefined || modData === null)?initialInput:modData);
    const [values,setValues] = useState((modData===undefined || modData === null)?initialInput:modData);
    const [array,setArray] = useState(generate(values.row,values.col,values.bombPercentage));
    const [showModal,setShowModal] = useState(0);
    const [counter,setCounter] = useState(countBombs(array));
    const [countFlags,setCountFlags] = useState(counterFlags(array));
    const [help,setHelp] = useState(0);

    useEffect(()=>{
        setCounter(countBombs(array));
        setCountFlags(counterFlags(array));
    },[array,help]);

    useEffect(()=>{
        const data = window.localStorage.getItem("MyValues");
        const modData =JSON.parse(data);
        if(modData!==undefined)
            setArray(JSON.parse(data));
    },[]);

    useEffect(()=>{
        setArray(generate(values.row,values.col,values.bombPercentage));
        window.localStorage.setItem("MyValues",JSON.stringify(values));
    },[values]);

    const func = ()=> {
        setArray(generate(values.row,values.col,values.bombPercentage));
    }
    const givenfunc = () => {
        setHelp(help===0?1:0);
    }
    //const changeCounter = () => {setCountFlags(countFlags(array));}
    const cong = () => {setShowModal(1); }
    const lose = () => {setShowModal(2); }
    const showConfig = () => {setShowModal(3);}
    const submitHandler = (e) =>{
        e.preventDefault();
        setValues(formValues);
        setShowModal(0);
    }
    const changeHandler = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    }
  return (
    <div className="App align-items-center d-flex flex-column p-0 m-0 justify-content-center">
        <h2 style={{color:"#234d0c"}}>Don't step on a butterfly!</h2>
        <Table arr={array} cong={cong} lose={lose}
               counter= {counter} countFlags = {countFlags} givenfunc={givenfunc}/>
        <Button className="mt-3 mb-2 btn-success" onClick={func}>Play again</Button>
        <Button className="btn-primary" onClick={showConfig}>Configuration</Button>
        <Modal
            show={showModal===3}
            onHide={()=>{setShowModal(0);}}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Configuration</Modal.Title>
            </Modal.Header>
            <Form onSubmit={submitHandler} className="">
                <Modal.Body>
                    <div className="d-flex flex-column">
                        <Form.Label>number of rows</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicRow">
                            <Form.Control name="row" value={formValues.row} type="number"
                                          placeholder="Enter number of rows" onChange={changeHandler}/>
                        </Form.Group>
                        <Form.Label>number of columns</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicCol">
                            <Form.Control value={formValues.col} type="number" name="col"
                                          placeholder="Enter number of columns" onChange={changeHandler}/>
                        </Form.Group>
                        <Form.Label>percentage of bombs</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicBombPercentage">
                            <Form.Control value={formValues.bombPercentage} type="number" name="bombPercentage"
                                          placeholder="Enter percentage of bombs" onChange={changeHandler}/>
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{setShowModal(0);}}>
                        Close
                    </Button>
                    <Button variant="success" onClick={()=>{setFormValues(initialInput);}} type= "submit">
                        Reset
                    </Button>
                    <Button variant="primary" type="submit">Change</Button>
                </Modal.Footer>
            </Form>
        </Modal>

        <Modal
            show={(showModal===1)}
            onHide={()=>{setShowModal(0);}}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Congratulations!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-row justify-content-evenly">
                    <div style={{backgroundImage:`url(${btfImg})`, backgroundSize:'100% 100%', width:"75px",height:"50px"}}></div>
                    <div style={{backgroundImage:`url(${btfImg})`, backgroundSize:'100% 100%', width:"75px",height:"50px"}}></div>
                    <div style={{backgroundImage:`url(${btfImg})`, backgroundSize:'100% 100%', width:"75px",height:"50px"}}></div>
                </div>
                <h4 className="text-center">
                    You've saved all the butterflies. Thanks!
                </h4>
                <div className="d-flex flex-row justify-content-evenly">
                    <div style={{backgroundImage:`url(${btfImg})`, backgroundSize:'100% 100%', width:"75px",height:"50px"}}></div>
                    <div style={{backgroundImage:`url(${btfImg})`, backgroundSize:'100% 100%', width:"75px",height:"50px"}}></div>
                    <div style={{backgroundImage:`url(${btfImg})`, backgroundSize:'100% 100%', width:"75px",height:"50px"}}></div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setShowModal(0);}}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>{setShowModal(0);func()}}>Play again</Button>
            </Modal.Footer>
        </Modal>

        <Modal
            show={(showModal===2)}
            onHide={()=>{setShowModal(0);}}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>You've just killed a butterfly!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-row justify-content-evenly">
                    <div style={{backgroundImage:`url(${cryImg})`, backgroundSize:'80% 100%', width:"75px",height:"50px", backgroundRepeat:"no-repeat"}}></div>
                    <div style={{backgroundImage:`url(${cryImg})`, backgroundSize:'80% 100%', width:"75px",height:"50px", backgroundRepeat:"no-repeat"}}></div>
                    <div style={{backgroundImage:`url(${cryImg})`, backgroundSize:'80% 100%', width:"75px",height:"50px", backgroundRepeat:"no-repeat"}}></div>
                </div>
                <h4 className="text-center m-2">
                    pitiful butterfly! :( :( :(
                </h4>
                <div className="d-flex flex-row justify-content-evenly">
                    <div style={{backgroundImage:`url(${cryImg})`, backgroundSize:'80% 100%', width:"75px",height:"50px", backgroundRepeat:"no-repeat"}}></div>
                    <div style={{backgroundImage:`url(${cryImg})`, backgroundSize:'80% 100%', width:"75px",height:"50px", backgroundRepeat:"no-repeat"}}></div>
                    <div style={{backgroundImage:`url(${cryImg})`, backgroundSize:'80% 100%', width:"75px",height:"50px", backgroundRepeat:"no-repeat"}}></div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setShowModal(0);}}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>{setShowModal(0);func()}}>Play again</Button>
            </Modal.Footer>
        </Modal>


    </div>
  );
}

export default App;
