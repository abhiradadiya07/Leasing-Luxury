/* eslint-disable react/prop-types */
const Image = ({ src, ...rest }) => {
  src =
    src && src.includes("https://")
      ? src
      : "https://leasing-luxury-api.vercel.app/uploads/" + src;
  return <img {...rest} src={src} alt={""} />;
};

export default Image;
