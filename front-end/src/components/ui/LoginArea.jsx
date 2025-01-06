import React, { useRef } from 'react';
import './LoginArea.css';
import { useNavigate } from 'react-router-dom';
import IconButton from './IconButton';
import ritLogo from '../../assets/branding/RIT_cmyk_hor.png';

const LoginArea = () => {
    const navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleLogin = async (e) => {
        e.preventDefault();

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try {
            const response = await fetch(
                `http://localhost:1000/login?username=${username}&password=${password}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            const data = await response.json();

            if (data.message === "Login successful") {
                // // console.log("Login successful", data);

                // localStorage.setItem('user', JSON.stringify(data.user));
                // localStorage.setItem('accessLevel', data.AccessLevel);

                navigate('/', {
                    state: {
                        username,
                        accessLevel: data.AccessLevel,
                        user: data.user
                    }
                });
            } else {
                console.error("Login failed", data);
                alert("Login failed: " + (data.message || 'Invalid credentials'));
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login.");
        }
    };

    return (
        <div className="loginForm">
            <img className='loginForm_logo' src={ritLogo} alt="" />
            <h2 className="loginForm_title">Log in to the peer evaluation tool</h2>
            <form onSubmit={handleLogin}>
                <div className="loginForm_inputGroup">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        ref={usernameRef}
                    />
                </div>
                <div className="loginForm_inputGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        ref={passwordRef}
                    />
                </div>

                <div className="loginForm_submitBtnContainer">
                    <IconButton
                        icon={""}
                        text="Login"
                        onClick={handleLogin}
                    />
                </div>
            </form>
            <div className="loginFormLinks">
                <a href="https://start.rit.edu/ForgotUsername?source=shib">Forgot Username?</a>
                <span> | </span>
                <a href="https://start.rit.edu/ForgotPassword?source=shib">Forgot Password?</a>
                <span> | </span>
                <a href="https://start.rit.edu/">Change Password</a>
            </div>
            <p className="loginForm_assistanceText">
                Need Assistance? Please contact the RIT service center at
                <a href="tel:585-475-5000">  585-475-5000</a> or visit <a href="https://help.rit.edu">help.rit.edu</a>
            </p>
        </div>
    );
}

export default LoginArea;
