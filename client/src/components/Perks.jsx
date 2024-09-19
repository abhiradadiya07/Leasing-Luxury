/* eslint-disable react/prop-types */

import { BoomBox, DoorOpen, Monitor, PawPrint, SquareParking, Wifi } from "lucide-react";

const Perks = ({ selected, onChange }) => {
  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter(selectedName => selectedName !== name)]);
    }
  }
  return (
    <>
      {[
        { name: 'wifi', icon: Wifi, label: 'Wifi', size: 23 },
        { name: 'parking', icon: SquareParking, label: 'Free parking spot', size: 30 },
        { name: 'tv', icon: Monitor, label: 'TV', size: 25 },
        { name: 'radio', icon: BoomBox, label: 'Radio' },
        { name: 'pets', icon: PawPrint, label: 'Pets' },
        { name: 'entrance', icon: DoorOpen, label: 'Private entrance', size: 30 }
      ].map(({ name, icon: Icon, label, size }) => (
        <label key={name} className="p-4 flex rounded-2xl gap-2 items-center cursor-pointer border-white border-2 bg-background">
          <input
            type="checkbox"
            checked={selected.includes(name)}
            name={name}
            onChange={handleCbClick}
          />
          <Icon size={size} />
          <span>{label}</span>
        </label>
      ))}
    </>
  );
}

export default Perks;