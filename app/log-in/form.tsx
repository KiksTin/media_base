"use client";
import Link from "next/link";
import { useState } from "react";


const LoginForm = () => {
    const [attempt, setAttempt] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    async function validate(e: React.FormEvent) {
        e.preventDefault();

        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const answerValue = (document.getElementById("answer") as HTMLInputElement)?.value || '';

        if (!username || !password) {
            alert("Username and password are required");
            return;
        }

        if (!answerValue) {
            alert("Security answer is required");
            return;
        }

        setIsLoading(true);

       //Login API for primary Auth
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, answer: answerValue }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                console.log('Login successful, redirecting...');

                if (username === 'admin') {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/profile";
                }
            } else {
                setAttempt(prev => prev - 1);
                alert(data.error || `You have left ${attempt - 1} attempt(s)`);
                
                if (attempt - 1 === 0) {
                    (document.getElementById("username") as HTMLInputElement).disabled = true;
                    (document.getElementById("password") as HTMLInputElement).disabled = true;
                    (document.getElementById("submit") as HTMLButtonElement).disabled = true;
                }
            }
    }

    async function fetchSecurityQuestion(username: string) {
        if (!username) {
            setSecurityQuestion('');
            return;
        }

        //Get security API to Fetch data for Secondary Auth
        
            const response = await fetch('/api/get-security-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (response.ok) {
                setSecurityQuestion(data.question || '');
            } else {
                setSecurityQuestion('');
            }
      
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const username = e.target.value;
        fetchSecurityQuestion(username);
    }

  return (
    <div className="log-in_form">

      <video autoPlay muted loop playsInline>
        <source src="/bg-swirl.mp4" type="video/mp4" />
      </video>

      <form onSubmit={validate}>
        <input type="text" placeholder="Username"  id="username" disabled={isLoading} onChange={handleUsernameChange}/>
        <input type="password" placeholder="Password" id="password" disabled={isLoading}/>
        {securityQuestion && (
            <>
                <p className="security-question">{securityQuestion}</p>
                <input type="text" placeholder="Security Answer" id="answer" disabled={isLoading} value={answer} onChange={(e) => setAnswer(e.target.value)}/>
            </>
        )}
        <button type="submit" id="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Log In'}</button>
        <hr/>
        <Link href="/">
          <button type="button" disabled={isLoading}>Continue as Guest</button>
        </Link>
      </form>
      
    </div>
  )
}
export default LoginForm