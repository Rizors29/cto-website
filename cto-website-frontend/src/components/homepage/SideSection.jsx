import SidebarButton from "./SidebarButton";
import OurPartner from "./OurPartner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  ComputerDesktopIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import DocumentList from "../resourcespage/DocumentList";

function SideSection() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  return (
    <aside className="md:col-span-1 flex flex-col gap-8">
      <section className="grid gap-3 grid-cols-3">
        <Link to={role === "admin" ? "/admin/request-dashboard" : "/internal/request-dashboard"}>
          <SidebarButton icon={ChartBarIcon} text="Request Dashboard" />
        </Link>

        <Link to="/inventory-dashboard">
          <SidebarButton icon={ChartPieIcon} text="Inventory Dashboard" />
        </Link>

        <Link to="/guideline-policy">
          <SidebarButton icon={ShieldCheckIcon} text="Technology Guidelines" />
        </Link>

        <Link to={role === "internal" ? "/request-form" : "/request-operation"}>
          <SidebarButton icon={BriefcaseIcon} text={role === "internal" ? "Request Form" : "Request Operation"} />
        </Link>

        <Link to={role === "internal" ? "/inventory-form" : "/inventory-operation"}>
          <SidebarButton icon={ComputerDesktopIcon} text={role === "internal" ? "Inventory Form" : "Inventory Operation"} />
        </Link>

        <Link to="/faqs">
          <SidebarButton icon={QuestionMarkCircleIcon} text="FAQs" />
        </Link>
      </section>

      <Link to="/about-us">
        <section className="relative rounded-lg overflow-hidden group">
          <img
            src="/images/ourteam.png"
            alt="Meet Our Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-all"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg">Meet Our Team</h3>
          </div>
        </section>
      </Link>

      <DocumentList variant="sidebar" />
      <OurPartner />
    </aside>
  );
}

export default SideSection;
