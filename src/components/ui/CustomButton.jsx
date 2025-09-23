import { DownloadIcon } from "lucide-react";
const CustomButton = ({ children, ...props }) => (
  <button {...props} className="bg-white border p-2 rounded w-full text-left flex flex-row">
     <DownloadIcon  />{children}
  </button>
);

export default CustomButton;
