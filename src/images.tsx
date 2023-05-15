import axios from "axios";
import React, { useState } from "react";

const Images = () => {
  const [image, setImage] = useState<FileList | null>(null);
  const [imagelink, setImageLink] = useState("");

  const uploadImage = () => {
    const formData = new FormData();
    formData.append("file", image![0]);
    formData.append("upload_preset", "qbftnsbx");

    axios
      .post("https://api.cloudinary.com/v1_1/dgk4dzdqu/image/upload", formData)
      .then((res) => {
        setImageLink(res.data.secure_url);
      });
  };

  return (
    <>
      <div>
        <input
          type="file"
          name="image"
          id="image"
          onChange={(e) => setImage(e.target.files)}
        />
        <button type="submit" onClick={uploadImage}>
          Upload
        </button>
        <img src={imagelink} alt="" width={600} height={400} />
      </div>
    </>
  );
};

export default Images;
