import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser, setReady } = useContext(UserContext);
  async function loginUser(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        "/login",
        {
          email,
          password,
        }
      );
      console.log(data);
      setUser(data);
      setReady(true);
      alert("Login is successful");
      setRedirect(true);
    } catch (e) {
      alert("Login is failed.");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-center mb-4 text-4xl">Login</h1>
        <form className="max-w-md mx-auto flex flex-col gap-2" onSubmit={loginUser}>
          <Input type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)} />

          <Input type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)} />
          <Button>LogIn</Button>
          <div className="text-center text-gray-500 py-2">
            Don&apos;t have an account yet?&nbsp;
            <Link to={"/register"} className="underline text-black">
              Register now
            </Link>
          </div>
        </form>
        <div className="text-center">
          <h4>Test User : abhishek@gmail.com</h4>
          Password : john123
        </div>
      </div>
    </div>
  );
};

export default Login;
