import AddressLink from "@/components/AddressLink";
import BookingWidget from "@/components/BookingWidget";
import PlaceGallery from "@/components/PlaceGallery";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePlace = () => {

    const { id } = useParams();
    const [place, setPlace] = useState(null);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return '';


    return (
        <div className="mt-4 px-4 pt-8 max-w-6xl mx-auto bg-gray-200 dark:bg-secondary rounded-2xl p-3">
            <h1 className="text-3xl mb-4 font-semibold">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place} />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}<br />
                    Check-out: {place.checkOut}<br />
                    Max number of guests: {place.maxGuests}
                </div>
                <div className="">
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-white dark:bg-background px-4 py-6 rounded-2xl">
                {place.extraInfo && (
                    <div>
                        <h2 className="font-semibold text-2xl dark:text-white">Extra info</h2>
                        <div className="mb-4 mt-2 text-sm text-muted-foreground leading-5">
                            {place.extraInfo}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SinglePlace