import AccountNav from "@/components/AccountNav"
import BookingDates from "@/components/BookingDates";
import PlaceImg from "@/components/PlaceImg";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/api/api";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axiosInstance.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <AccountNav />
      <div className="max-w-5xl mx-auto">
        {bookings?.length > 0 && bookings.map((booking, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mt-4 bg-gray-200 dark:bg-secondary p-4 rounded-2xl overflow-hidden">
            <Link to={`/account/bookings/${booking._id}`} className="flex flex-col md:flex-row gap-4 items-center flex-grow">
              <div className="w-full md:w-48 h-48 rounded-2xl bg-white dark:bg-background flex items-center justify-center overflow-hidden">
                <PlaceImg place={booking.place} className="w-full h-full object-cover" />
              </div>
              <div className="py-3 pr-3 grow flex flex-col">
                <h2 className="text-lg sm:text-xl font-normal">{booking.place.title}</h2>
                <div className="text-base sm:text-lg flex flex-col">
                  <BookingDates booking={booking} className="mb-2 mt-4" />
                  <div className="flex gap-1 items-center mt-2">
                    <CreditCard size={24} />
                    <span className="text-base sm:text-lg md:text-xl font-semibold">
                      Total price: ${booking.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex justify-center md:justify-end mt-4 md:mt-0">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Are you sure you want to cancel this booking?')) {
                    axiosInstance.post(`/bookings/${booking._id}/cancel`)
                      .then(() => {
                        setBookings(bookings.filter(b => b._id !== booking._id));
                        toast({
                          title: "Success",
                          description: "Booking cancelled successfully!",
                          variant: "success",
                        });
                      })
                      .catch(error => {
                        console.error('Error cancelling booking:', error);
                        toast({
                          title: "Error",
                          description: "Failed to cancel booking: " + (error.response?.data?.message || "Unknown error"),
                          variant: "destructive",
                        });
                      });
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full md:w-auto"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bookings;
