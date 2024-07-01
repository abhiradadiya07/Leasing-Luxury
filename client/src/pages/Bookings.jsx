import AccountNav from "@/components/AccountNav"
import BookingDates from "@/components/BookingDates";
import PlaceImg from "@/components/PlaceImg";
import axios from "axios";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Bookings = () => {

  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="max-w-5xl mx-auto">
        {bookings?.length > 0 && bookings.map((booking, index) => (
          <Link to={`/account/bookings/${booking._id}`} key={index} className="gap-4 mt-2 h-40 bg-gray-200 items-center p-4 rounded-2xl overflow-hidden flex" >
            <div className="w-48 rounded-sm">
              <PlaceImg place={booking.place} />
            </div>
            <div className="py-3 pr-3 grow">
              <h2 className="text-md sm:text-xl font-normal">{booking.place.title}</h2>
              <div className="text-xl">
                <BookingDates booking={booking} className="mb-2 mt-4" />
                <div className="flex gap-1">
                  <CreditCard size={27} />
                  <span className="text-md md:text-2xl font-semibold">
                    Total price: ${booking.price}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Bookings;
