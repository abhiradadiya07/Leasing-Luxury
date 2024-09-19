/* eslint-disable react/prop-types */
const Image = ({ src, ...rest }) => {
  src =
    src && src.includes("https://")
      ? src
      : "http://localhost:3000/uploads/" + src;
  return <img {...rest} src={src} alt={""} />;
};

export default Image;
