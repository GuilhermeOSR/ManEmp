import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../services/firebase'; 
import { FaGoogle } from 'react-icons/fa';  
import "../Styles/loginstyle.css";


const signInWithGoogle = async () => {
  try {

    const provider = new GoogleAuthProvider();


    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    console.log("Usuário autenticado:", user);


    alert("Login bem-sucedido!");

  } catch (error) {
    console.error("Erro ao fazer login com o Google:", error);
    alert("Erro ao fazer login.");
  }
};

const Login = () => {
  return (
    <div className="login-container">
      <h2 style={{color: 'black'}}>Login</h2>

      <button className="google-login-button" onClick={signInWithGoogle}>
        <FaGoogle className="google-icon" /> Login com Google
      </button>
    </div>
  );
};

export default Login;