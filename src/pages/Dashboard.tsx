import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import RSVPLogo from "../assets/rsvp.svg";
import WedeaseLogo from "../assets/wedease.svg";

interface RouteItem {
    to: string;
    text: string;
    image: string;
    alt: string;
    className: string;
    isExternal: boolean;
}

const routes: RouteItem[] = [
    {
        to: "/rsvp-dashboard",
        text: "RSVP Dashboard",
        image: RSVPLogo,
        alt: "RSVP Dashboard",
        className: "h-16 sm:h-20 md:h-24 lg:h-28",
        isExternal: false
    }
];

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={WedeaseLogo} 
                                alt="Wedease Logo" 
                                className="h-8 sm:h-12 md:h-14 lg:h-16" 
                            />
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900">
                                    Dashboard
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">
                                    Welcome to Wedease Admin Dashboard
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {routes.map((link: RouteItem, index: number) => (
                        <Link
                            key={index}
                            to={link.to}
                            target={link.isExternal ? "_blank" : undefined}
                            className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-200 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <img 
                                            alt={link.alt} 
                                            src={link.image} 
                                            className={`${link.className} transition-transform duration-200 group-hover:scale-110`} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-900 transition-colors duration-200">
                                        {link.text}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Click to access dashboard
                                    </p>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="bg-red-900 text-white p-2 rounded-full shadow-lg">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-900 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
                        </Link>
                    ))}

                    {Array.from({ length: Math.max(0, 3 - routes.length) }, (_, i) => (
                        <div 
                            key={`placeholder-${i}`} 
                            className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center opacity-50"
                        >
                            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                                <span className="text-gray-400 text-2xl">+</span>
                            </div>
                            <p className="text-sm text-gray-400">More features coming soon</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;