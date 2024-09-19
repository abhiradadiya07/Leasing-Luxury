import { UserContext } from "@/UserContext";
import AccountNav from "@/components/AccountNav";
import Perks from "@/components/Perks";
import PhotosUploader from "@/components/PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PlacesForm = () => {

    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);
    const { ready, user } = useContext(UserContext);



    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    }, [id]);

    if (ready && !user) {
        return <Navigate to={"/login"} />;
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        };
        try {
            if (id) {
                // update
                await axios.put("/places", {
                    id,
                    ...placeData,
                });
                toast({
                    title: "Success",
                    description: "Place updated successfully!",
                    variant: "success",
                });
            } else {
                // new place
                await axios.post("/places", placeData);
                toast({
                    title: "Success",
                    description: "New place added successfully!",
                    variant: "success",
                });
            }
            setRedirect(true);
        } catch (error) {
            console.error("Error saving place:", error);
            toast({
                title: "Error",
                description: "Failed to save place. Please try again.",
                variant: "destructive",
            });
        }
    }

    if (redirect) {
        return <Navigate to={"/account/places"} />;
    }

    function inputHeader(text) {
        return <h2 className="text-2xl mt-4">{text}</h2>;
    }
    function inputDescription(text) {
        return <p className="text-gray-500 text-sm">{text}</p>;
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    return (
        <>
            <AccountNav />
            <div className="max-w-5xl mx-auto dark:bg-secondary bg-gray-200 p-6 rounded-2xl">
                <form onSubmit={savePlace}>
                    {preInput(
                        "Title",
                        "Title for your place. should be short and catchy as in advertisement"
                    )}
                    <Input
                        type="text"
                        value={title}
                        onChange={(ev) => setTitle(ev.target.value)}
                        required
                        placeholder="title, for example: My lovely apt"
                    />

                    {preInput("Address", "Address to this place")}
                    <Input
                        type="text"
                        value={address}
                        onChange={(ev) => setAddress(ev.target.value)}
                        required
                        placeholder="address"
                    />

                    {preInput("Photos", "more = better")}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                    {preInput("Description", "description of the place")}
                    <Textarea
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)} />
                    {preInput("Perks", "select all the perks of your place")}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks} />
                    </div>
                    {preInput("Extra info", "house rules, etc")}
                    <Textarea
                        value={extraInfo}
                        onChange={(ev) => setExtraInfo(ev.target.value)} />

                    {preInput(
                        "Check in&out times",
                        "add check in and out times, remember to have some time window for cleaning the room between guests"
                    )}
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div>
                            <h3 className="mt-2 -mb-1">Check in time</h3>
                            <Input
                                type="text"
                                value={checkIn}
                                onChange={(ev) => setCheckIn(ev.target.value)}
                                placeholder="14"
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Check out time</h3>
                            <Input
                                type="text"
                                value={checkOut}
                                onChange={(ev) => setCheckOut(ev.target.value)}
                                placeholder="11"
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Max number of guests</h3>
                            <Input
                                type="number"
                                value={maxGuests}
                                onChange={(ev) => setMaxGuests(Number(ev.target.value))}
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">Price per night</h3>
                            <Input
                                type="number"
                                value={price}
                                onChange={(ev) => setPrice(Number(ev.target.value))}
                            />
                        </div>
                    </div>
                    <Button className="w-full mt-2 text-white text-xl">Save</Button>
                </form>
            </div>
        </>
    )
}

export default PlacesForm