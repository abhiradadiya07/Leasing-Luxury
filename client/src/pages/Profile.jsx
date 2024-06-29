import { UserContext } from "@/UserContext";
import AccountNav from "@/components/AccountNav";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";

const Profile = () => {

    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);

    // console.log(ready);
    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    if (!ready) {
        return <div>Loading...</div>;
    }
    if (ready && !user && !redirect) {
        return <Navigate to={"/login"} />;
    }
    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <>
            <AccountNav/>
            <div className="text-center max-w-lg mx-auto flex flex-col items-center text-2xl">
                Logged in as {user?.name}
                <Button onClick={logout} className=" mt-2 w-full text-xl rounded-full text-white">Logout</Button>
            </div>
        </>
    )
}

export default Profile