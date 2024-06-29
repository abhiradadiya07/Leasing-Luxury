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
  // useEffect(() => {
  //   if (!id) {
  //     return;
  //   }
  //   axios.get("/places/" + id).then((response) => {
  //     const { data } = response;
  //     setTitle(data.title);
  //     setAddress(data.address);
  //     setAddedPhotos(data.photos);
  //     setDescription(data.description);
  //     setPerks(data.perks);
  //     setExtraInfo(data.extraInfo);
  //     setCheckIn(data.checkIn);
  //     setCheckOut(data.checkOut);
  //     setMaxGuests(data.maxGuests);
  //     setPrice(data.price);
  //   });
  // }, [id]);
  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full mb-4" to={'/account/places/new'}>
          <Plus />
          Add new place
        </Link>
      </div>
      {places.length > 0 && places.map((place, index) => (
        <Link to={'/account/places/' + place._id} key={index} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
          <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
            <PlaceImg place={place} />
          </div>
          <div className="grow-0 shrink">
            <h2 className="text-xl">{place.title}</h2>
            <p className="text-sm mt-2">{place.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
