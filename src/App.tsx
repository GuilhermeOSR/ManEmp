import React from 'react';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Content from './components/Content';
import AddEmployes from './components/AddEmployes';
import ListEmployes from './components/ListEmployes';
import EditEmployes from './components/EditEmployes';



function App() {

  return (
    <Router>
     <Header />
     <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/add-employee" element={<AddEmployes />} />
            <Route path="/list-employee" element={<ListEmployes />} />
            <Route path="/edit/:id" element={<EditEmployes />} /> 
   
      </Routes>
    </Router> 

    

  );
}

export default App;
