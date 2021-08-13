import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./Login.css";

export default function Login({ setShowLogin,myStorage,setCurrentUserName }) {
 
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
     
      password: passwordRef.current.value,
    };

    try {
      const response=await axios.post("/users/login", newUser);
      setError(false);
      myStorage.setItem("user",response.data.username)
      setCurrentUserName(response.data.username)
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>Pin your review</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
       
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit">
         Login
        </button>
         
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="loginCancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
}