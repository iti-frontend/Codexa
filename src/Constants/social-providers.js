import { FaGithub, FaGoogle } from "react-icons/fa";

export const SOCIAL_PROVIDERS = [
  {
    name: "Google",
    icon: FaGoogle,
    onClick: () => console.log("Google login"),
  },
  {
    name: "GitHub",
    icon: FaGithub,
    onClick: () => console.log("GitHub login"),
  },
];
