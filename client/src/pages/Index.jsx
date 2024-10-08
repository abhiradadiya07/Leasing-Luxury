import axiosInstance from "@/api/api";
import Image from "@/components/Image";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axiosInstance.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
      {places.length > 0 && places.map((place, index) => (
        <Link to={'/place/' + place._id} key={index} className="dark:bg-secondary bg-gray-200 p-3 rounded-2xl">
          <div className="bg-gray-400 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt="" />
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-card-foreground">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Index