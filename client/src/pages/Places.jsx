// import AccountNav from "../components/AccountNav.jsx";
import { Link, Navigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AccountNav from "@/components/AccountNav.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "@/components/PlaceImg";
import { UserContext } from "@/UserContext";

export default function Places() {
  const [places, setPlaces] = useState([]);
  const { ready, user } = useContext(UserContext);

  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <AccountNav />
      <div className="text-center max-w-5xl mx-auto">
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full mb-4" to={'/account/places/new'}>
          <Plus />
          Add new place
        </Link>
      </div>
      {places.length > 0 && places.map((place, index) => (
        <Link to={'/account/places/' + place._id} key={index} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-2 max-w-5xl mx-auto">
          <div className="flex w-40 h-40 bg-gray-300 shrink-0">
            <PlaceImg place={place} />
          </div>    
          <div className="grow-0 shrink">
            <h2 className="text-2xl font-bold">{place.title}</h2>
            <p className="text-md mt-2 ">{place.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
