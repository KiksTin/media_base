import { neon } from '@neondatabase/serverless';
import "./page.css";
import LoginForm from './form';

const sql = neon(process.env.DATABASE_URL!);
const response = await sql`SELECT * FROM mb_user`;
console.log(response);

if(response.length === 0) {
  console.log("No users found");
}

const LoginFormPage = async () => {
  return (
   <LoginForm response={response} />
  )
}
export default LoginFormPage