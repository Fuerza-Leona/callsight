"use client";
import { useState } from "react";
import { sideNavLinks } from "../constants/index.js";

const SideNavItems = () => {
    return (
        <ul className="flex flex-col items-center text-center gap-4 lg:gap-6 relative z-20 pt-15 md:pt-10">
            {sideNavLinks.map(({ id, href, name }) => (
                <li key={id} className="text-neutral-400 hover:text-white max-lg:hover:bg-[#13202A]/50 max-lg:w-full max-lg:rounded-md py-2 max-lg:px-5">
                    <a href={href} className="text-lg lg:text-base hover:text-white transition-colors w-full block">
                        {name}
                    </a>
                </li>
            ))}
        </ul>
    );
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((prevIsOpen) => !prevIsOpen);

    return (
        <>
            <button 
                className="fixed top-4 left-4 z-[100] text-neutral-400 hover:text-white focus:outline-none lg:hidden flex  p-3 rounded-md"
                onClick={toggleMenu} 
                aria-label="Toggle menu"
            >
                <img src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"} alt="toggle" className="w-6 h-6 mt-4" />
            </button>

            <aside className={`h-screen w-full md:w-64 pt-20 lg:w-64 bg-[#13202A] z-20 transition-all duration-300 ease-in-out fixed left-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:fixed lg:translate-x-0`}>
                <div className="flex flex-col justify-between h-full py-5">
                    <nav className="lg:flex w-full ml-5">
                        <SideNavItems />
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;