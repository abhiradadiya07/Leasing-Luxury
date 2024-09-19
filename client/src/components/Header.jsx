import { AlignJustify, Map, UserRound } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ModeToggle } from "./mode-toggle";


const Header = () => {
  const { user } = useContext(UserContext);
  return (
    <header className="flex justify-between w-full h-14 px-4 py-6 items-center sticky top-0 z-50 bg-white dark:bg-background">
      <Link to={"/"} className="flex text-2xl gap-2">
        <Map className="w-10 h-10" />
        <span className="font-bold text-3xl hidden sm:inline">Leasing Luxury</span>
      </Link>
      <div className="hidden md:flex py-2 px-4 gap-2 rounded-full border border-gray-300 shadow-md shadow-gray-300">
        <div className="">Anywhere</div>
        <div className="border-l border-gray-300"></div>
        <div className="">Any week</div>
        <div className="border-l border-gray-300"></div>
        <div className="">Add guests</div>
        {/* <button className="bg-inherit">
          <Search className="bg-primary text-white p-1 rounded-full" />
        </button> */}
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Link
          to={user ? "/account" : "/login"}
          className="flex py-2 px-4 gap-2 rounded-full border border-gray-300 items-center"
        >
          <AlignJustify />
          <UserRound className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden" />
          {!!user && <div>{user.name}</div>}
        </Link>
      </div>
    </header>
  );
};

export default Header;
