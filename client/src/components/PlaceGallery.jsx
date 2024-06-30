/* eslint-disable react/prop-types */
import { useState } from "react";
import Image from "./Image.jsx";
import { CircleX, ImagePlus } from "lucide-react";

// eslint-disable-next-line react/prop-types
export default function PlaceGallery({ place }) {

    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-white text-white min-h-screen grow z-50">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white p-8 grid gap-4">
                        <div>
                            <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
                            <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black">
                                <CircleX />
                                Close photos
                            </button>
                        </div>
                        {place?.photos?.length > 0 && place.photos.map((photo, index) => (
                            <div key={index}>
                                <Image src={photo} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative max-h-50">
            <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                <div>
                    {place.photos?.[0] && (
                        <div>
                            <Image onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={place.photos[0]} alt="" />
                        </div>
                    )}
                </div>
                <div className="grid">
                    {place.photos?.[1] && (
                        <Image onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={place.photos[1]} alt="" />
                    )}
                    <div className="overflow-hidden">
                        {place.photos?.[2] && (
                            <Image onClick={() => setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover relative top-2" src={place.photos[2]} alt="" />
                        )}
                    </div>
                </div>
            </div>
            <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500">
                <ImagePlus />
                Show more photos
            </button>
        </div>
    );
}