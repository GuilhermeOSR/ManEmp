import React from 'react';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Content from './components/Content';
import AddEmployes from './components/AddEmployes';




function App() {

  return (
    <Router>
     <Header />
     <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/add-employee" element={<AddEmployes />} />
      </Routes>
    </Router> 

    

  );
}

export default App;
