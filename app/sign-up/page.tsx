"use client"
import "./page.css"
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/log-in');
      } else {
        setError(data.error || 'Sign up failed');
      }
    } catch (error) {
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
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <hr/>
        <Link href="/">
          <button type="button">Continue as Guest</button>
        </Link>
      </form>
      
    </div>
  )
}
export default SignUpForm