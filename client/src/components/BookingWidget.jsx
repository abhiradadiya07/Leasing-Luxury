/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/UserContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axiosInstance from "@/api/api";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        if (!user) {
            setRedirect('/login')
            return
        }
        const response = await axiosInstance.post('/bookings', {
            checkIn, checkOut, numberOfGuests, name, phone,
            place: place._id,
            price: numberOfNights * place.price,
        });
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white dark:bg-background shadow-gray-400 shadow-sm drop-shadow-2xl p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="md:flex">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        <Input type="date"
                            value={checkIn}
                            required
                            onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check out:</label>
                        <Input type="date" value={checkOut}
                            required
                            onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests:</label>
                    <Input type="number"
                        value={numberOfGuests}
                        required
                        onChange={ev => setNumberOfGuests(ev.target.value)} />
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your full name:</label>
                        <Input type="text"
                            value={name}
                            required
                            onChange={ev => setName(ev.target.value)} />
                        <label>Phone number:</label>
                        <Input type="tel"
                            value={phone}
                            required
                            onChange={ev => setPhone(ev.target.value)} />
                    </div>
                )}
            </div>
            <div className="text-center">
                <Button onClick={bookThisPlace} className="mt-2 text-white text-md w-full rounded-full  ">
                    Book this place
                    {numberOfNights > 0 && (
                        <span> ${numberOfNights * place.price}</span>
                    )}
                </Button>
            </div>

        </div>
    );
}