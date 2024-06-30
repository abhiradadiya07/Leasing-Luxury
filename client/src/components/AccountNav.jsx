import { Building, Sofa, UserRound } from "lucide-react";
import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function AccountNav() {

  const { pathname } = useLocation()
  let subpage = pathname.split('/')?.[2]

  if (subpage === undefined) {
    subpage = "profile"
  }
  const linkClasses = useCallback((type) => {
    let classes = "px-6 mx-2 py-2 inline-flex justify-center gap-2 rounded-full";
    if (type === subpage) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }, [subpage])

  return (
    <nav className="mt-10 gap-2 mb-8 flex flex-col justify-center sm:flex-row">
      <Link to={"/account"} className={linkClasses("profile")}>
        <UserRound />
        My Profile
      </Link>
      <Link to={"/account/bookings"} className={linkClasses("bookings")}>
        <Building />
        My Booking
      </Link>
      <Link to={"/account/places"} className={linkClasses("places")}>
        <Sofa />
        My Accommodations
      </Link>
    </nav>
  );
}
