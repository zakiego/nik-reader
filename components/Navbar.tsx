import { Logout } from "~/components/UI/Logout";

export const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center space-x-1">
        <div className="h-5 w-5 bg-hitam-900 rounded-md" />
        <div className="text-2xl font-black">NIK</div>
      </div>
      {/* <Logout /> */}
    </div>
  );
};
