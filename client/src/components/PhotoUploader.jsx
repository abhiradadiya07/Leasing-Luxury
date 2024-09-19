/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import Image from "./Image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { CloudUpload, Star, Trash2 } from "lucide-react";


export default function PhotosUploader({
  addedPhotos,
  onChange,
}) {
  const [photoLink, setPhotoLink] = useState("");
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      onChange([...addedPhotos, filename]);
      setPhotoLink("");
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append("photos", files[i]);
      }
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange(addedPhotos => {
          return [...addedPhotos, ...filenames]
        });
      });
  }

  function removePhoto(
    ev,
    filename
  ) {
    ev.preventDefault();
    onChange([...addedPhotos.filter((photo) => photo !== filename)]);
  }
  function selectAsMainPhoto(
    ev,
    filename
  ) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter((photo) => photo !== filename)]);
  }

  return (
    <>
      <div className="flex gap-2">
        <Input value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          type="text"
          placeholder={"Add using a link ....jpg"} />

        <Button onClick={addPhotoByLink}
          className="text-white text-md h-10 mt-1">
          Add&nbsp;photo
        </Button>
      </div>
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="h-32 flex relative" key={link}>
              <Image
                className="rounded-2xl w-full object-cover"
                src={link}
                alt=""
              />
              <button
                onClick={(ev) => removePhoto(ev, link)}
                className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={(ev) => selectAsMainPhoto(ev, link)}
                className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
              >
                {link === addedPhotos[0] && (
                  <Star size={21} strokeWidth={0} fill="yellow" />
                )}
                {link !== addedPhotos[0] && (
                  <Star size={21} />
                )}
              </button>
            </div>
          ))}

        <Label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-card rounded-2xl p-2 text-2xl font-medium">
          <Input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
          />
          <CloudUpload className="w-8 h-8" />
          Upload
        </Label>
      </div>
    </>
  );
}

