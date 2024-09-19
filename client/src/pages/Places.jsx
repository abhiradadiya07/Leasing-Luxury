// import AccountNav from "../components/AccountNav.jsx";
import { Link, Navigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AccountNav from "@/components/AccountNav.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "@/components/PlaceImg";
import { UserContext } from "@/UserContext";
import { toast } from "@/hooks/use-toast";

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
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full mb-4 font-semibold" to={'/account/places/new'}>
          <Plus />
          Add new place
        </Link>
      </div>
      {places.length > 0 && places.map((place, index) => (
        <div key={index} className="flex cursor-pointer gap-4 bg-gray-200 dark:bg-secondary p-4 rounded-2xl mt-2 max-w-5xl mx-auto">
          <Link to={'/account/places/' + place._id} className="flex flex-grow gap-4">
            <div className="flex w-50 h-50 bg-gray-300 overflow-hidden rounded-2xl">
              <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-2xl font-bold">{place.title}</h2>
              <p className="text-md mt-2 ">{place.description}</p>
            </div>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm('Are you sure you want to cancel this place?')) {
                axios.delete(`/places/${place._id}`)
                  .then(() => {
                    setPlaces(places.filter(p => p._id !== place._id));
                    toast({
                      title: "Success",
                      description: "Place cancelled successfully!",
                      variant: "success",
                    });
                  })
                  .catch(error => {
                    console.error('Error cancelling place:', error);
                    toast({
                      title: "Error",
                      description: "Failed to cancel place: " + (error.response?.data?.message || "Unknown error"),
                      variant: "destructive",
                    });
                  });
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 h-fit"
          >
            Cancel Place
          </button>
        </div>
      ))}
    </div>
  );
}
