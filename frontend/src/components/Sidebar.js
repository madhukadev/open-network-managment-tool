import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, BarChart, ShieldCheck, Bell, FileText, LogOut } from "lucide-react";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { name: "Real-Time Monitoring", path: "/dashboard", icon: BarChart },
    { name: "Security & Intrusion Detection", path: "/security", icon: ShieldCheck },
    { name: "Automated Alerts", path: "/alerts", icon: Bell },
    { name: "Bandwidth Analysis", path: "/bandwidth", icon: BarChart },
    { name: "Reports & Analytics", path: "/reports", icon: FileText },
  ];

  return (
    <div className={`h-screen ${isExpanded ? "w-64" : "w-20"} bg-gray-900 text-white p-4 shadow-lg transition-all duration-300`}> 
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-white mb-6 focus:outline-none"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Content */}
      <nav>
        <ul className="space-y-3">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <motion.li
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
              >
                <Icon size={20} />
                {isExpanded && <span>{name}</span>}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
