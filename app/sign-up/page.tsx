"use client"
import "./page.css"
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const validatePassword = () => {

    const specialCharsElement = document.getElementById('special-chars');
    const lengthElement = document.getElementById('length');
    const uppercaseElement = document.getElementById('uppercase');
    const lowercaseElement = document.getElementById('lowercase');
    const numbersElement = document.getElementById('numbers');
    
    if (specialCharsElement) {
        const specialChars = '!$@#%^&*()-+=[]{}|\'<>.?,/';
            if(password.split('').some(char => specialChars.includes(char))) {
                specialCharsElement.style.color="green";
                console.log("Special chars found");
            }else{
                console.log("Special chars not found");
                specialCharsElement.style.color="red";
            }
    }
    
    if(lengthElement) {
        if(password.length >= 8) {
            lengthElement.style.color="green";
            console.log("Length found");
        }else{
            console.log("Length not found");
            lengthElement.style.color="red";
        }
    }

    if(lowercaseElement) {
        if(password.match(/[a-z]/)) {
            lowercaseElement.style.color="green";
            console.log("Lowercase found");
        }else{
            console.log("Lowercase not found");
            lowercaseElement.style.color="red";
        }
    }

    if(uppercaseElement){
      if(password.match(/[A-Z]/)) {
        uppercaseElement.style.color="green";
        console.log("Uppercase found");
      }else{
        console.log("Uppercase not found");
        uppercaseElement.style.color="red";
      }
    }
    if(numbersElement){
      if(password.match(/[0-9]/)) {
        numbersElement.style.color="green";
        console.log("Numbers found");
      }else{
        console.log("Numbers not found");
        console.log("Numbers not found");
        numbersElement.style.color="red";
      }
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username.trim(),
          user_password: password,
          user_email: email.trim(),
          user_question: question.trim(),
          user_answer: answer.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/log-in");
      } else {
        setError(data.error || 'Failed to sign up');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up_form">

      <video autoPlay muted loop playsInline>
        <source src="/bg-swirl.mp4" type="video/mp4" />
      </video>
      <form onSubmit={handleSubmit}>
  
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyUp={validatePassword}
          disabled={isLoading}
        />
         <p>Password Requirement</p>
          <ol>
            <li id="length">At least 8 characters</li>
            <li id="special-chars">At least one special character</li>
            <li id="uppercase">At least one uppercase letter</li>
            <li id="lowercase">At least one lowercase letter</li>
            <li id="numbers">At least one number</li>
          </ol>
        
        {error && <p className="error-message">{error}</p>}

          <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input 
          type="text" 
          placeholder="Question" 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
        />
        <input 
          type="text" 
          placeholder="Answer" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading}
        />
        
        {error && <p className="error-message">{error}</p>}
    
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <Link href="/">
          <button type="button">Continue as Guest</button>
        </Link>
       </form>
    </div>

  )
}
export default SignUpForm