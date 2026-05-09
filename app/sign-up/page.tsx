"use client"
import "./page.css"
import Link from "next/link";

const SignUpForm = () => {
  return (
    <div className="sign-up_form">

      <video autoPlay muted loop playsInline>
        <source src="/bg-swirl.mp4" type="video/mp4" />
      </video>

      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
        <hr/>
        <Link href="/">
          <button type="button">Continue as Guest</button>
        </Link>
      </form>
      
    </div>
  )
}
export default SignUpForm