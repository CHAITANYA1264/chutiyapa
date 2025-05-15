import Image from "next/image";
import icon from './favicon.ico'
const Navbar = () => {
  return (
    <header className="w-full bg-blue-700 shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 mx-auto">
        {/* Optional Logo image */}
         <Image src={icon} alt="Logo" width={32} height={32} />
        <span className="text-xl font-bold text-gray-900">Stock Management System</span>
      </div>
    </header>
  );
};

export default Navbar;
