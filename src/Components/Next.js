import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Button from './abc';
import '../App.css';

import axios from "axios";
function Next(props) {
    //console.log(props.dataToNext)
    const [questions, setquestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers,setanswers]=useState(new Map());
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [level, setlevel] = useState(1);
    const [vis,setvis]=useState(new Array(10).fill(0))
    const [err,seterr] = useState(false);

    const changeQuestion=(e)=>{
        setCurrentQuestion(+e.target.value-1)
    }
    const getquestions = () => {
        useEffect(() => {
            if(localStorage.answers)
              setanswers(new Map(JSON.parse(localStorage.answers)))

            if(localStorage.currentQuestion){
                console.log(localStorage.currentQuestion)
                setCurrentQuestion(+localStorage.currentQuestion)
            }
           
            if(localStorage.visited )
            {   const ar=localStorage.visited.split(",")
                if(Math.max(ar)!=0)setvis(ar)
            }

            let lg=props.dataToNext ||localStorage.getItem("language");
            axios.get("http://localhost:5001/questions/" + lg + "/" + level).then((res) => {
                setquestions(...questions, res.data.questions);
                console.log(res.data);
            }
            ).catch(function (error) {
                // if (error.response) {
                  console.log(error);
                  seterr(true);
                //   console.log(error.response.status);
                //   console.log(error.response.headers);
                // }
            });
        }, [])
        
    }
    getquestions();
    //console.log(questions);
    const NextQuestion = () => {

        if (currentQuestion + 1 < questions.length)
        {
            setCurrentQuestion(currentQuestion + 1);
            localStorage.setItem("currentQuestion",currentQuestion+1)
        }
        else {
            setShowScore(true);
        }

    }
    const PrevQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
        localStorage.setItem("currentQuestion",currentQuestion-1)
    }
    const setCurrentOption = index => e => {
      console.log(answers);
      setanswers(new Map(answers.set(currentQuestion,index)));
      let a1=answers
      let k=vis
      console.log(vis)
      k[currentQuestion]=1
      setvis(k)
      
      a1.set(currentQuestion,index)
      localStorage.setItem("visited",k)
      localStorage.setItem("answers",JSON.stringify(Array.from(a1.entries())))
    }
    const validate=()=>
    {    console.log(answers);
        let cnt=0;
        localStorage.removeItem("answers")
        localStorage.removeItem("currentQuestion")
        localStorage.removeItem("visited")
        for (const [key, value] of answers.entries()) {
            if(questions[key].answers[0]["text"]===questions[key].options[value]["text"])cnt++;
        }
        setScore(cnt)
        const a={"score":cnt}
        

        axios.post("http://localhost:5001/log-client-errors/",{a}).then(res => {
            //console.log(res);
            alert(res)
            //logger.info(res)
            //console.log(res.data);
          })
        // console.log(cnt)
        const percentage = (cnt / questions.length) * 100
            console.log(cnt, percentage);
            if (percentage >= 60) {
                setlevel(2)   
            }
            setShowScore(true);
    }
    const delstorage=()=>
    {
        localStorage.removeItem("answers")
        localStorage.removeItem("currentQuestion")
        localStorage.removeItem("visited")
        refresh();
    }
    const refresh=()=>window.location.reload();
    return (<>
            { err? 
            <div class="alert alert-danger text-center mt-3" role="alert">
                    Database Application is not connected
            </div>:(<h1></h1>)
            }
    
        <div className='container d-flex'>
            
            {showScore ? (<div style={{marginTop:"10%",marginLeft:"35%",fontSize:"30px" }} >
                You scored {score} out of {questions.length}
                {level == 2 ?
                    (<>
                    <div >
                        <br></br>
                         <span className='result' style={{fontSize:"30px"}}>You are Qualified to Level 2 </span><br></br>
                         <br></br>
                        <div className='Image'><img src='https://i.gifer.com/Ju9P.gif' style={{height:"40%" , width:"40%"}}></img></div>
                       
                        <Link to="/display/level2"><button className='button1' style={{ fontSize: "16px",padding: "15px 32px", margin:"4px 2px", cursor: "pointer",marginTop:"4%",marginLeft:"10%",onClick:"animated"}}>Level 2</button></Link><br></br>
                    </div>
                    </>
                    ) :
                    (<>
                        <div className='mt-2' style={{display:"block",fontSize:"30px"}}>
                             You are Not Qualified for Level 2 Please Try Again !!
                             
                             <br></br><br></br>
                             <div className='Image'><img src='https://www.sorryimages.love/images/quotes/english/general/cute-sorry-animated-image-gif-52650-304402.gif' style={{height:"40%" , width:"40%"}}></img></div>
                        <button className='button2' onClick={delstorage}  style={{ fontSize: "16px",padding: "15px 32px", margin:"4px 2px", cursor: "pointer",marginTop:"4%",marginLeft:"10%"}}>Level-1</button>
                        </div>
                    </>)}
            </div>) : (
                
                <>  
                 <div style={{border:"3px solid black",maxWidth:"15%",padding:"1%",marginLeft:"1%",marginTop:"18%"}}>
                    <button className="button" value="1" style={{backgroundColor: (vis[0]==0) ? "orange":"green" }} onClick={changeQuestion}>1</button>
                    <button className="button" value="2" style={{backgroundColor: (vis[1]==0) ? "orange":"green" }} onClick={changeQuestion}>2</button>
                    <button className="button" value="3" style={{backgroundColor: (vis[2]==0) ? "orange":"green" }} onClick={changeQuestion}>3</button>
                    <button className="button" value="4" style={{backgroundColor: (vis[3]==0) ? "orange":"green" }} onClick={changeQuestion}>4</button>
                    <button className="button" value="5" style={{backgroundColor: (vis[4]==0) ? "orange":"green" }} onClick={changeQuestion}>5</button>
                    <button className="button" value="6" style={{backgroundColor: (vis[5]==0) ? "orange":"green" }} onClick={changeQuestion}>6</button>
                    <button className="button" value="7" style={{backgroundColor: (vis[6]==0) ? "orange":"green" }} onClick={changeQuestion}>7</button>
                    <button className="button" value="8" style={{backgroundColor: (vis[7]==0) ? "orange":"green" }} onClick={changeQuestion}>8</button>
                    <button className="button" value="9" style={{backgroundColor: (vis[8]==0) ? "orange":"green" }} onClick={changeQuestion}>9</button>
                    <button className="button" value="10"style={{backgroundColor: (vis[9]==0) ? "orange":"green" }} onClick={changeQuestion}>10</button>
                </div> 
                <div className='questions' style={{marginLeft:"30%",marginTop:"20%"}}>
                    <h2 >Welcome to {props.dataToNext} quiz Level {level}</h2>
                    {questions.map(function (d, idx) {
                        if (idx == currentQuestion) return (
                            <>
                                <div className='question-section'>
                                    <div className='question-count'>
                                        <span>Question { currentQuestion + 1}</span>/{questions.length}
                                    </div>
                                    <div className='question-text'><h4>{d.question}</h4></div>
                                </div>
                                <div className='answer-section'>
                                {d["options"].map((o, index) => (
                                    <> <div className="form-check">
                                        <input className="form-check-input" onChange={setCurrentOption(index)} type="radio" name="radio" value={o.text}  checked = {index==answers.get(currentQuestion)} ></input>
                                        <label className="form-check-label" for={index} >{o.text}</label>
                                    </div>
                                    </>
                                ))}
                                </div>
                                <br></br>
                                <div className='d-flex '>
                                {
                                    currentQuestion!=0 ?(
                                    <button style={{marginLeft:"5%"}} type="button" className='btn btn-info mt-3' onClick={PrevQuestion}>Previous</button>):
                                    (<div></div>)
                                }
                                {
                                    currentQuestion!=(questions.length-1)?(
                                    <button style={{marginLeft:"45%"}} type="button" className='btn btn-info mt-3' onClick={NextQuestion}>Next</button>):
                                    (<button style={{marginLeft:"45%"}} type="button" className='btn btn-info mt-3' onClick={validate}>Submit</button>)
                                }
                                </div>
                            </>
                        )
                    })
                    }
                    
                </div>
                </>
            )
            }
        </div>
    </>
    )
}

export default Next