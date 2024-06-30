import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Layout from "./Layout";
import Register from "./pages/Register";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Profile from "./pages/Profile";
import Places from "./pages/Places";
import Bookings from "./pages/Bookings";
import PlacesForm from "./pages/PlacesForm";
import NotFound from "./pages/NotFound";
import SinglePlace from "./pages/SinglePlace";
import SingleBooking from "./pages/SingleBooking";

axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.withCredentials = true;

function App() {


  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/account/places" element={<Places />} />
          <Route path="/account/places/new" element={<PlacesForm />} />
          <Route path="/account/places/:id" element={<PlacesForm />} />
          <Route path="/place/:id" element={<SinglePlace />} />
          <Route path="/account/bookings" element={<Bookings />} />
          <Route path="/account/bookings/:id" element={<SingleBooking />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContextProvider>
  )
}

export default App
