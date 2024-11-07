import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Content from './components/Content';
import AddEmployes from './components/AddEmployes';
import ListEmployes from './components/ListEmployes';
import EditEmployes from './components/EditEmployes';
import LoginGoogle from './components/LoginGoogle';
import { auth } from './services/firebase'; // Importa a configuração do Firebase

function App() {
  const [user, setUser] = useState<any>(null);  


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); 
    });

 
    return () => unsubscribe();
  }, []);

  if (user === null) {
    return <LoginGoogle />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Content />} />

        {/* Rotas protegidas */}
        <Route 
          path="/add-employee" 
          element={user ? <AddEmployes /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/list-employee" 
          element={user ? <ListEmployes /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/edit/:id" 
          element={user ? <EditEmployes /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;