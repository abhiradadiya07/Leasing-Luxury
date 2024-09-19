import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState("");

  async function registerUser(ev) {
    ev.preventDefault();
    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
      });
      const { message } = response.data;
      console.log(message,"*************");
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
      setRedirect("/login");
    } catch (e) {
      toast({
        title: "Error",
        description: e.response?.data?.error || e.response?.data?.message || "Registration failed", 
        variant: "default",
      });
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32 border-2 border-primary p-8 rounded-md" style={{ width: '400px' }}>
        <h1 className="text-center mb-4 text-4xl">Register</h1>
        <form className="max-w-md mx-auto flex flex-col gap-2" onSubmit={registerUser}>
          <div className="mb-4">
            <Label htmlFor="name" className="block mb-2">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </div>
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
          <Button type="submit" className="w-full">Register</Button>
          <div className="text-center mt-4">
            Already a member?{" "}
            <Link className="underline" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
