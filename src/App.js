import React, { useState } from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Level2 from './Components/Level2';
import Next from './Components/Next';


function App() {
  const [language, setlanguage] = useState("")
  /*const style=  {backgroundImage:"url(https://cdn.pixabay.com/photo/2018/02/27/15/40/background-3185765__340.jpg)",height:"100%",width:"100%","background-position": "center",
    "background-repeat": "no-repeat",
    "background-size": "cover","border-style":"solid",backgroundRepeat:"no-repeat"}*/
   const dataToApp = (data) =>{
    setlanguage(data)
    // console.log(language)
  }
  return (
    <div className='App' >
    <BrowserRouter>
        <Routes>
        <Route exact path="/"  element={<Home dataToApp={dataToApp}/>}></Route>
        <Route exact path="/display/level1" element={<Next dataToNext={language}/>}></Route>
        <Route exact path="/display/level2" element={<Level2 dataToNext={language} level={2} />}></Route>
        
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
