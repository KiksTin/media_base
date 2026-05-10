"use client";
import Link from "next/link";


const LoginForm = ({response}: {response: any}) => {

    var attempt = 3;

    function validate(e: React.FormEvent) {
    e.preventDefault();
    
    var username = (document.getElementById("username") as HTMLInputElement).value;
    var password = (document.getElementById("password") as HTMLInputElement).value;

    var userFound = false;

    for (var i = 0; i < response.length; i++) {
        if (username == response[i].user_name && password == response[i].user_password) {
            userFound = true;
            break;
        }
    }

    if (userFound) {
      
        const loggedInUser = response[i];
        sessionStorage.setItem('currentUser', JSON.stringify({
            user_id: loggedInUser.user_id,
            user_name: loggedInUser.user_name,
            user_email: loggedInUser.user_email,
            user_profile: loggedInUser.user_profile
        }));
        console.log('Login successful, redirecting...');
        window.location.href = "/profile";

         } else {
        attempt--;
        alert("You have left " + attempt + " attempt(s);");
      
        if (attempt == 0) {
            (document.getElementById("username") as HTMLInputElement).disabled = true;
            (document.getElementById("password") as HTMLInputElement).disabled = true;
            (document.getElementById("submit") as HTMLButtonElement).disabled = true;
        }
        return false;
    }
}

  return (
    <div className="log-in_form">

      <video autoPlay muted loop playsInline>
        <source src="/bg-swirl.mp4" type="video/mp4" />
      </video>

      <form onSubmit={validate}>
        <input type="text" placeholder="Username"  id="username"/>
        <input type="password" placeholder="Password" id="password"/>
        <button type="submit" id="submit">Log In</button>
        <hr/>
        <Link href="/">
          <button type="button">Continue as Guest</button>
        </Link>
      </form>
      
    </div>
  )
}
export default LoginForm