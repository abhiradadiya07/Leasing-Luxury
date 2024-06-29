import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [redirect,setRedirect] = useState("")
  async function registerUser(ev) {
    ev.preventDefault();
    try {

      await axios.post("/register", {
        name,
        email,
        password,
      });
      alert('Registration successful. Now you can log in');
      setRedirect("/login")
    } catch (e) {
      alert("Registration is failed.");
    }
  }

  if(redirect){
    return <Navigate to={"/login"} />
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-center mb-4 text-4xl ">Register</h1>
        <form className=" max-w-md mx-auto flex flex-col gap-2" onSubmit={registerUser}>
          <Input type="text"
            placeholder="John Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)} />
          <Input type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)} />
          <Input type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)} />
          <Button > Register</Button>
          <div className="text-center text-gray-500 py-2">
            Already have an account?&nbsp;
            <Link to={"/login"} className="underline text-black">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
