import { navItems } from "@/Constants/Home-data";
import { Button } from "../ui/button";

function HomeNavMenu(props) {
  return (
    <div {...props}>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button asChild variant={"ghost"} key={item.href}>
            <a
              key={item.href}
              href={item.href}
              className="bg-transparent text-primary hover:text-white hover:bg-primary !rounded-md"
            >
              <Icon className="w-4 h-4 lg:hidden" />
              <span className="block">{item.label}</span>
            </a>
          </Button>
        );
      })}
    </div>
  );
}
export default HomeNavMenu;

// "use client";

// import { navItems } from "@/Constants/Home-data";
// import { Link } from "react-scroll";

// function HomeNavMenu(props) {
//   return (
//     <div {...props}>
//       {navItems.map((item) => {
//         const Icon = item.icon;

//         return (
//           <Link
//             key={item.href}
//             to={item.href}
//             spy={true}
//             className="flex items-center gap-2 px-3 py-2 rounded-md transition w-full text-sm
//                        hover:bg-accent hover:text-accent-foreground
//                        cursor-pointer"
//             activeClass="bg-primary text-white hover:bg-primary hover:text-white"
//           >
//             <Icon className="w-4 h-4 lg:hidden" />
//             <span className="block">{item.label}</span>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }

// export default HomeNavMenu;
