import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function loginUser(ev) {
    ev.preventDefault();
    try {
      const response = await axiosInstance.post("/login", { email, password }, { withCredentials: true });
      const token = response.headers['authorization']
      localStorage.setItem('accessToken', token);
      setUser(response.data.user);
      toast({
        title: "Success",
        description: "Login successful",
        variant: "success",
      });
      navigate("/");
    } catch (e) {
      toast({
        title: "Error",
        description: "Login failed: " + (e.response?.data?.message || "Unknown error"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32 border-primary border-2 p-8 rounded-md" style={{ width: '400px' }}>
        <h1 className="text-center mb-4 text-4xl">Login</h1>
        <form className="max-w-md mx-auto flex flex-col gap-2" onSubmit={loginUser}>
          <div className="mb-4">
            <Label htmlFor="email" className="block mb-2">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="block mb-2">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Log In</Button>
          <div className="text-center mt-4">
            Don&apos;t have an account yet?{" "}
            <Link to={"/register"} className="underline">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
