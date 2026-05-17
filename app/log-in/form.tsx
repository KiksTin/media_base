"use client";
import Link from "next/link";
import { useState } from "react";


const LoginForm = () => {
    const [attempt, setAttempt] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    async function validate(e: React.FormEvent) {
        e.preventDefault();
        
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        if (!username || !password) {
            alert("Username and password are required");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                console.log('Login successful, redirecting...');
                window.location.href = "/profile";
            } else {
                setAttempt(prev => prev - 1);
                alert(data.error || `You have left ${attempt - 1} attempt(s)`);
                
                if (attempt - 1 === 0) {
                    (document.getElementById("username") as HTMLInputElement).disabled = true;
                    (document.getElementById("password") as HTMLInputElement).disabled = true;
                    (document.getElementById("submit") as HTMLButtonElement).disabled = true;
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="log-in_form">

      <video autoPlay muted loop playsInline>
        <source src="/bg-swirl.mp4" type="video/mp4" />
      </video>

      <form onSubmit={validate}>
        <input type="text" placeholder="Username"  id="username" disabled={isLoading}/>
        <input type="password" placeholder="Password" id="password" disabled={isLoading}/>
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