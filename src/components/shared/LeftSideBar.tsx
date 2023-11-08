import { useUserContext } from "@/context/AuthContext";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queryAndMutations";
import { useEffect } from "react";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSideBar = () => {
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to={`/`} className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <div className="flex gap-4">
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        </div>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`group leftsidebar-link ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  className={`flex gap-4 items-center p-4`}
                  to={link.route}
                >
                  <img
                    src={link.imgURL}
                    alt="linkLabel"
                    className={`group-hover:inver-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant={`ghost`}
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSideBar;
