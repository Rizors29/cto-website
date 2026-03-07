import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";

import api from "../utils/api";
import ENDPOINTS from "../utils/endpoint";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [email, setEmail] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(ENDPOINTS.PROFILE);
        if (response.data.photo) {
          setPhoto(`http://localhost:8000/storage/${response.data.photo}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false)
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");
    const userPhoto = localStorage.getItem("photo");

    if (token) {
      setRole(userRole);
      setEmail(userEmail);
      setPhoto(userPhoto);
    }
  }, []);

  useEffect(() => {
    const syncPhoto = () => {
      setPhoto(localStorage.getItem("photo"));
    };

    window.addEventListener("storage", syncPhoto);

    return () => {
      window.removeEventListener("storage", syncPhoto);
    };
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap justify-between items-center mx-auto p-3">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="/images/weblogo.png" className="h-15" alt="Logo" />
        </Link>

        {/* Mobile Button */}
        <div className="flex">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading"
          >
            <Bars3Icon />
          </button>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center p-1 rounded-full hover:bg-gray-100">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-300" />
              )}
            </button>

            {openProfile && (
              <div className="absolute right-0 w-48 top-15 bg-white rounded-sm border-gray-300 border z-10">
                <ul className="p-2 text-sm font-semibold text-blue-950">
                  <li>
                    <Link
                      to="/profile"
                      className="block p-2 rounded hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                        window.location.reload();
                      }}
                      className="w-full text-left p-2 text-red-500 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className={`${isOpen ? "block" : "hidden"} bg-white rounded-lg w-full md:flex md:items-center md:w-auto md:flex-1`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 bg-neutral-secondary-soft md:bg-transparent font-medium md:flex-1 md:justify-center">
            {/* Home */}
            <li>
              <Link to="/" className="block py-2 px-3 bg-brand rounded text-blue-950 hover:bg-gray-100">
                Home
              </Link>
            </li>

            {/* Dashboards */}
            <li className="relative group">
              <button className="flex items-center py-2 px-3 w-full rounded text-heading md:w-auto text-blue-950 hover:bg-gray-100 cursor-pointer" onClick={() => toggleMenu("dashboards")}>
                Dashboards
                <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="hidden rounded-sm border-1 border-gray-300 md:group-hover:block absolute bg-white rounded-base w-44">
                <ul className="p-2 text-sm font-medium">
                  <li>
                    <Link to={role === "admin"
                      ? "/admin/request-dashboard"
                      : "/internal/request-dashboard"} className="block p-2 hover:bg-neutral-tertiary-medium rounded text-blue-950 hover:bg-gray-100">
                      Request Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/inventory-dashboard" className="block p-2 hover:bg-neutral-tertiary-medium rounded text-blue-950 hover:bg-gray-100">
                      Inventory Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              {isOpen && openMenu === "dashboards" && (
                <div className="md:hidden bg-gray-100 rounded-base w-full mt-2 rounded-lg">
                  <ul className="p-2 text-sm font-semibold text-blue-950">
                    <li><Link to={role === "admin" ? "/admin/request-dashboard" : "/internal/request-dashboard"} className="block p-2 hover:bg-gray-100">Request Dashboard</Link></li>
                    <li><Link to="/inventory-dashboard" className="block p-2 hover:bg-gray-100">Inventory Dashboard</Link></li>
                  </ul>
                </div>
              )}
            </li>

            {/* Forms */}
            {role === "internal" && (
              <li className="relative group">
                <button
                  className="flex items-center py-2 px-3 w-full rounded text-blue-950 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleMenu("forms")}
                >
                  Forms
                  <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {/* Desktop */}
                <div className="hidden rounded-sm border-1 border-gray-300 md:group-hover:block absolute bg-white rounded-base w-44">
                  <ul className="p-2 text-sm font-medium">
                    <li>
                      <Link
                        to="/request-form"
                        className="block p-2 rounded text-blue-950 hover:bg-gray-100"
                      >
                        Request Form
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/inventory-form"
                        className="block p-2 rounded text-blue-950 hover:bg-gray-100"
                      >
                        Inventory Form
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Mobile */}
                {isOpen && openMenu === "forms" && (
                  <div className="md:hidden bg-gray-100 rounded-lg w-full mt-2">
                    <ul className="p-2 text-sm font-semibold text-blue-950">
                      <li>
                        <Link to="/request-form" className="block p-2">
                          Request Form
                        </Link>
                      </li>
                      <li>
                        <Link to="/inventory-form" className="block p-2">
                          Inventory Form
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}

            {role === "admin" && (
              <li className="relative group">
                <button
                  className="group flex items-center py-2 px-3 w-full rounded text-blue-950 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleMenu("services")}
                >
                  Services
                  <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {/* Desktop */}
                <div className="hidden rounded-sm border-1 border-gray-300 md:group-hover:block absolute bg-white rounded-base w-44">
                  <ul className="p-2 text-sm font-medium">
                    <li>
                      <Link
                        to="/request-operation"
                        className="block p-2 rounded text-blue-950 hover:bg-gray-100"
                      >
                        Request Operation
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/inventory-operation"
                        className="block p-2 rounded text-blue-950 hover:bg-gray-100"
                      >
                        Inventory Operation
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Mobile */}
                {isOpen && openMenu === "services" && (
                  <div className="md:hidden bg-gray-100 rounded-lg w-full mt-2">
                    <ul className="p-2 text-sm font-semibold text-blue-950">
                      <li>
                        <Link to="/request-operation" className="block p-2">
                          Request Operation
                        </Link>
                      </li>
                      <li>
                        <Link to="/inventory-operation" className="block p-2">
                          Inventory Operation
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}

            <li className="relative group">
              <button className="flex items-center py-2 px-3 w-full text-heading rounded md:w-auto hover:text-fg-brand text-blue-950 hover:bg-gray-100 cursor-pointer" onClick={() => toggleMenu("resources")}>
                Resources
                <ChevronDownIcon className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="hidden rounded-sm border-1 border-gray-300 md:group-hover:block absolute bg-white rounded-base w-44">
                <ul className="p-2 text-sm font-medium">
                  <li>
                    <Link to="/guideline-policy" className="block p-2 hover:bg-neutral-tertiary-medium rounded text-blue-950 hover:bg-gray-100">
                      Guideline & Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/document-library" className="block p-2 hover:bg-neutral-tertiary-medium rounded text-blue-950 hover:bg-gray-100">
                      Document Library
                    </Link>
                  </li>
                </ul>
              </div>
              {isOpen && openMenu === "resources" && (
                <div className="md:hidden bg-gray-100 rounded-base w-full mt-2 rounded-lg">
                  <ul className="p-2 text-sm font-semibold text-blue-950">
                    <li>
                      <Link to="/guideline-policy" className="block p-2 hover:bg-neutral-tertiary-medium rounded text-blue-950 hover:bg-gray-100">
                        Guideline & Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/document-library" className="block p-2 hover:bg-neutral-tertiary-medium rounded text-blue-950 hover:bg-gray-100">
                        Document Library
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link to="/about-us" className="block py-2 px-3 rounded text-blue-950 hover:bg-gray-100">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="block py-2 px-3 rounded text-blue-950 hover:bg-gray-100">
                FAQs
              </Link>
            </li>
          </ul>
          <ul className="hidden md:flex md:flex-col md:flex-row md:items-center md:ml-auto p-4 md:p-0">
            <li className="relative group">
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/50 m-auto border-t-transparent rounded-full animate-spin"></div>
                ) : photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <UserCircleIcon className="w-9 h-9 text-gray-300" />
                )}
              </button>

              <div className="hidden group-hover:block absolute right-0 w-48 bg-white rounded-sm border-gray-300 border z-10">
                <div className="px-4 py-3 border-b border-gray-300">
                  <p className="text-sm font-semibold text-gray-700">Logged in as</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>

                <ul className="p-2 text-sm font-semibold text-blue-950">
                  <li>
                    <Link
                      to="/profile"
                      className="block p-2 rounded hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                        window.location.reload();
                      }}
                      className="w-full text-left p-2 text-red-500 rounded hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
