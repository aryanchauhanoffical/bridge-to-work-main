import { useEffect, useRef, useState } from "react";
import { JobData } from "./JobCard";
import { NGOData } from "./NGOCard";
import {
  MapPin,
  Navigation,
  Compass,
  ArrowUpRight,
  Search,
  Map,
  Layers,
  Plus,
  Minus,
  Route,
  X,
  Clock,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import styled from "styled-components";

interface MapViewProps {
  jobs: JobData[];
  ngos: NGOData[];
  activeType: "jobs" | "services";
  serviceFilter?: "all" | "ngo" | "shelter" | "training";
}

interface Neighborhood {
  name: string;
  top: number;
  left: number;
}

// More detailed Indian cities data with neighborhoods and local areas
const INDIAN_CITIES = [
  {
    name: "Mumbai",
    top: 65,
    left: 22,
    mapImage: "/lovable-uploads/7f141b1c-2f50-4c12-95f5-0bdace710a44.png",
    neighborhoods: [
      { name: "Colaba", top: 85, left: 25, jobCount: 1 },
      { name: "Bandra", top: 55, left: 15, jobCount: 0 },
      { name: "Andheri", top: 40, left: 20, jobCount: 0 },
      { name: "Juhu Beach", top: 45, left: 10, jobCount: 0 },
      { name: "Worli", top: 70, left: 20, jobCount: 0 },
      { name: "Powai", top: 30, left: 30, jobCount: 0 },
    ],
    landmarks: ["Gateway of India", "Marine Drive"],
  },
  {
    name: "Delhi",
    top: 30,
    left: 48,
    mapImage: "/lovable-uploads/7f141b1c-2f50-4c12-95f5-0bdace710a44.png",
    neighborhoods: [
      { name: "Connaught Place", top: 35, left: 50, jobCount: 1 },
      { name: "Chandni Chowk", top: 25, left: 45, jobCount: 0 },
      { name: "Hauz Khas", top: 40, left: 45, jobCount: 0 },
      { name: "India Gate", top: 35, left: 55, jobCount: 0 },
      { name: "Dwarka", top: 45, left: 35, jobCount: 0 },
      { name: "Saket", top: 50, left: 50, jobCount: 0 },
    ],
    landmarks: ["Red Fort", "Qutub Minar"],
  },
  {
    name: "Bangalore",
    top: 75,
    left: 38,
    mapImage: "/lovable-uploads/7f141b1c-2f50-4c12-95f5-0bdace710a44.png",
    neighborhoods: [
      { name: "Indiranagar", top: 70, left: 42, jobCount: 1 },
      { name: "Koramangala", top: 80, left: 40, jobCount: 0 },
      { name: "MG Road", top: 75, left: 35, jobCount: 0 },
      { name: "Electronic City", top: 90, left: 38, jobCount: 0 },
      { name: "Whitefield", top: 65, left: 50, jobCount: 0 },
      { name: "Jayanagar", top: 80, left: 30, jobCount: 0 },
    ],
    landmarks: ["Cubbon Park", "Lalbagh"],
  },
  {
    name: "Hyderabad",
    top: 68,
    left: 45,
    mapImage: "/lovable-uploads/7f141b1c-2f50-4c12-95f5-0bdace710a44.png",
    neighborhoods: [
      { name: "Banjara Hills", top: 65, left: 47, jobCount: 1 },
      { name: "Jubilee Hills", top: 60, left: 43, jobCount: 0 },
      { name: "Hitech City", top: 55, left: 40, jobCount: 0 },
      { name: "Charminar", top: 75, left: 48, jobCount: 0 },
      { name: "Gachibowli", top: 70, left: 35, jobCount: 0 },
      { name: "Secunderabad", top: 60, left: 50, jobCount: 0 },
    ],
    landmarks: ["Hussain Sagar", "Golconda Fort"],
  },
  // Other cities with similar pattern
  {
    name: "Chennai",
    top: 80,
    left: 45,
    mapImage: "/lovable-uploads/7f141b1c-2f50-4c12-95f5-0bdace710a44.png",
    neighborhoods: [
      { name: "T. Nagar", top: 82, left: 43 },
      { name: "Mylapore", top: 85, left: 47 },
      { name: "Adyar", top: 88, left: 46 },
      { name: "Marina Beach", top: 80, left: 50 },
      { name: "Anna Nagar", top: 75, left: 40 },
      { name: "Velachery", top: 90, left: 42 },
    ],
    landmarks: ["Kapaleeshwarar Temple", "Fort St. George"],
  },
];

// Sample NGO and Service Data
const SAMPLE_SERVICES: NGOData[] = [
  // NGO Services
  {
    id: "ngo1",
    name: "Youth Empowerment Foundation",
    description:
      "Providing skill development and career guidance to underprivileged youth.",
    address: "Connaught Place, Delhi",
    phone: "+91-11-2345-6789",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM",
    services: ["Career Counseling", "Skill Training", "Job Placement"],
    type: "ngo",
    contactInfo: {
      phone: "+91-11-2345-6789",
      email: "contact@yef.org",
      website: "www.yef.org",
    },
  },
  {
    id: "ngo2",
    name: "Community Support Network",
    description:
      "Supporting local communities through education and employment initiatives.",
    address: "Bandra, Mumbai",
    phone: "+91-22-3456-7890",
    hours: "Mon-Fri: 8:30 AM - 5:30 PM",
    services: [
      "Education Support",
      "Community Development",
      "Employment Assistance",
    ],
    type: "ngo",
    contactInfo: {
      phone: "+91-22-3456-7890",
      email: "info@csn.org",
      website: "www.csn.org",
    },
  },

  // Shelters
  {
    id: "sh1",
    name: "Safe Haven Shelter",
    description:
      "Temporary accommodation and support services for job seekers.",
    address: "Indiranagar, Bangalore",
    phone: "+91-80-4567-8901",
    hours: "24/7 Service",
    services: ["Accommodation", "Meals", "Job Search Support"],
    type: "shelter",
    contactInfo: {
      phone: "+91-80-4567-8901",
      email: "contact@safehaven.org",
      website: "www.safehaven.org",
    },
  },
  {
    id: "sh2",
    name: "New Beginnings Center",
    description: "Short-term housing with career development programs.",
    address: "Charminar, Hyderabad",
    phone: "+91-40-5678-9012",
    hours: "24/7 Service",
    services: ["Housing", "Career Guidance", "Basic Necessities"],
    type: "shelter",
    contactInfo: {
      phone: "+91-40-5678-9012",
      email: "help@newbeginnings.org",
      website: "www.newbeginnings.org",
    },
  },

  // Training Centers
  {
    id: "tr1",
    name: "SkillBridge Academy",
    description:
      "Vocational training and certification programs for various industries.",
    address: "MG Road, Bangalore",
    phone: "+91-80-6789-0123",
    hours: "Mon-Sat: 10:00 AM - 7:00 PM",
    services: ["Technical Training", "Soft Skills", "Certification"],
    type: "training",
    contactInfo: {
      phone: "+91-80-6789-0123",
      email: "learn@skillbridge.edu",
      website: "www.skillbridge.edu",
    },
  },
  {
    id: "tr2",
    name: "Digital Skills Institute",
    description: "Modern technology and digital skills training center.",
    address: "Hitech City, Hyderabad",
    phone: "+91-40-7890-1234",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    services: ["Computer Training", "Digital Marketing", "Web Development"],
    type: "training",
    contactInfo: {
      phone: "+91-40-7890-1234",
      email: "info@digitalskills.edu",
      website: "www.digitalskills.edu",
    },
  },
  {
    id: "tr3",
    name: "Hospitality Training Center",
    description:
      "Professional training for hospitality and service industry jobs.",
    address: "Worli, Mumbai",
    phone: "+91-22-8901-2345",
    hours: "Mon-Sat: 8:00 AM - 8:00 PM",
    services: ["Hotel Management", "Customer Service", "Food Service"],
    type: "training",
    contactInfo: {
      phone: "+91-22-8901-2345",
      email: "train@hospitalityskills.edu",
      website: "www.hospitalityskills.edu",
    },
  },
];

// Mock data for the map display
const SAMPLE_JOBS: JobData[] = [
  // Kitchen Helper Jobs
  {
    id: "kh1",
    title: "Kitchen Helper",
    description:
      "Assist in food preparation, cleaning, and serving in a busy community kitchen. Flexible hours, meals provided.",
    company: "Community Eats",
    location: "Delhi",
    localArea: "Connaught Place",
    salary: "12000",
    duration: "Ongoing",
    skills: ["Food prep", "Cleaning", "Basic English"],
    date: "Today",
  },
  {
    id: "kh2",
    title: "Kitchen Helper",
    description:
      "Join our kitchen team to help with food preparation and kitchen maintenance. Training provided for enthusiastic learners.",
    company: "Mumbai Meals",
    location: "Mumbai",
    localArea: "Bandra",
    salary: "15000",
    duration: "Full-time",
    skills: ["Kitchen safety", "Team work", "Basic cooking"],
    date: "This week",
  },
  {
    id: "kh3",
    title: "Kitchen Helper",
    description:
      "Work in a dynamic hotel kitchen environment. Great opportunity to learn from professional chefs.",
    company: "Bangalore Grand Hotel",
    location: "Bangalore",
    localArea: "MG Road",
    salary: "13500",
    duration: "Part-time",
    skills: ["Hygiene standards", "Quick learning", "Kitchen operations"],
    date: "Tomorrow",
  },

  // Street Cleaning Jobs
  {
    id: "sc1",
    title: "Street Cleaning",
    description:
      "Join a team cleaning up the neighborhood streets. Equipment provided, no experience needed.",
    company: "Clean Streets Program",
    location: "Mumbai",
    localArea: "Colaba",
    salary: "11000",
    duration: "Weekly",
    skills: ["Outdoors", "Community minded", "Physical work"],
    date: "This week",
  },
  {
    id: "sc2",
    title: "Street Cleaning",
    description:
      "Be part of our city beautification initiative. Morning shifts available with good compensation.",
    company: "Delhi Municipal",
    location: "Delhi",
    localArea: "Chandni Chowk",
    salary: "12500",
    duration: "Monthly",
    skills: ["Early morning work", "Team coordination", "Physical stamina"],
    date: "Today",
  },
  {
    id: "sc3",
    title: "Street Cleaning",
    description:
      "Help maintain the cleanliness of our tech park area. Regular schedule with benefits.",
    company: "Tech Park Maintenance",
    location: "Bangalore",
    localArea: "Electronic City",
    salary: "13000",
    duration: "Full-time",
    skills: ["Reliability", "Physical fitness", "Basic tools operation"],
    date: "Next week",
  },

  // Moving Assistant Jobs
  {
    id: "ma1",
    title: "Moving Assistant",
    description:
      "Help with loading and unloading furniture and boxes. One-time opportunity with immediate payment.",
    company: "QuickMove Services",
    location: "Bangalore",
    localArea: "Indiranagar",
    salary: "8000",
    duration: "1 day",
    skills: ["Heavy lifting", "Attention to detail", "Teamwork"],
    date: "Tomorrow",
  },
  {
    id: "ma2",
    title: "Moving Assistant",
    description:
      "Assist in office relocation project. Multiple day assignment with good pay.",
    company: "Corporate Movers",
    location: "Mumbai",
    localArea: "Worli",
    salary: "9000",
    duration: "3 days",
    skills: ["Strength", "Careful handling", "Organization"],
    date: "This weekend",
  },
  {
    id: "ma3",
    title: "Moving Assistant",
    description:
      "Help families move homes. Flexible schedule with regular work opportunities.",
    company: "Family Relocation Services",
    location: "Delhi",
    localArea: "Dwarka",
    salary: "8500",
    duration: "Flexible",
    skills: ["Customer service", "Physical work", "Time management"],
    date: "Today",
  },

  // Garden Assistant (keeping one for variety)
  {
    id: "ga1",
    title: "Garden Assistant",
    description:
      "Help with basic gardening tasks including weeding, planting, and watering. No experience necessary, tools and guidance provided.",
    company: "Green City Initiative",
    location: "Hyderabad",
    localArea: "Banjara Hills",
    salary: "14000",
    duration: "1-2 days",
    skills: ["Physical work", "Outdoors", "Garden maintenance"],
    date: "Today",
  },
];

const MarkerCard = styled.div<{
  isSelected: boolean;
  serviceType?: "ngo" | "shelter" | "training";
}>`
  position: absolute;
  background: white;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: ${(props) =>
    props.isSelected
      ? "0 8px 16px rgba(0, 0, 0, 0.15)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)"};
  border-left: 4px solid
    ${(props) => {
      if (props.serviceType === "ngo") return "#ec4899";
      if (props.serviceType === "shelter") return "#8b5cf6";
      if (props.serviceType === "training") return "#f59e0b";
      return props.isSelected ? "#2563eb" : "#4b5563";
    }};
  transform: ${(props) => (props.isSelected ? "scale(1.05)" : "scale(1)")};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  z-index: ${(props) => (props.isSelected ? 10 : 1)};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    border-left-color: ${(props) => {
      if (props.serviceType === "ngo") return "#ec4899";
      if (props.serviceType === "shelter") return "#8b5cf6";
      if (props.serviceType === "training") return "#f59e0b";
      return "#2563eb";
    }};
  }

  .title {
    font-weight: 600;
    font-size: 1rem;
    color: #1f2937;
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .company {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 4px;
  }

  .details {
    display: flex;
    gap: 8px;
    font-size: 0.75rem;
    color: #6b7280;
    align-items: center;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .service-type {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 8px;
    background-color: ${(props) => {
      if (props.serviceType === "ngo") return "#fce7f3";
      if (props.serviceType === "shelter") return "#ede9fe";
      if (props.serviceType === "training") return "#fef3c7";
      return "#e0e7ff";
    }};
    color: ${(props) => {
      if (props.serviceType === "ngo") return "#be185d";
      if (props.serviceType === "shelter") return "#5b21b6";
      if (props.serviceType === "training") return "#92400e";
      return "#3730a3";
    }};
  }

  .view-more {
    margin-top: 8px;
    font-size: 0.75rem;
    color: #2563eb;
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export default function MapView({
  jobs,
  ngos,
  activeType,
  serviceFilter = "all",
}: MapViewProps) {
  const [currentCity, setCurrentCity] = useState(INDIAN_CITIES[0]);
  const [selectedItem, setSelectedItem] = useState<JobData | NGOData | null>(
    null
  );
  const [currentServiceFilter, setCurrentServiceFilter] =
    useState(serviceFilter);
  const [mapView, setMapView] = useState<"street" | "satellite" | "standard">(
    "standard"
  );
  const [zoom, setZoom] = useState(1);

  // Filter items based on selected city and service type
  const filteredItems =
    activeType === "jobs"
      ? jobs.filter((job) => job.location.includes(currentCity.name))
      : SAMPLE_SERVICES.filter(
          (service) =>
            (currentServiceFilter === "all" ||
              service.type === currentServiceFilter) &&
            service.address.includes(currentCity.name)
        );

  return (
    <div className="w-full h-full">
      {/* Map Container */}
      <div className="w-full h-full bg-gray-50 relative">
        {/* Base Map Layer */}
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage:
              mapView === "street"
                ? `url('${currentCity.mapImage}')`
                : mapView === "satellite"
                ? "url('/lovable-uploads/165c8b71-2cca-4b61-99b2-3c5414e1c0ec.png')"
                : "linear-gradient(to bottom, #f0f8ff, #ffffff)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-30 flex flex-col gap-4">
            {/* View Type Controls */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
              <button
                className={`p-2 rounded-md ${
                  mapView === "street"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setMapView("street")}
              >
                <Map className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  mapView === "satellite"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setMapView("satellite")}
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-md ${
                  mapView === "standard"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setMapView("standard")}
              >
                <Compass className="w-5 h-5" />
              </button>
            </div>

            {/* Service Type Filter */}
            {activeType === "services" && (
              <div className="bg-white rounded-lg shadow-lg p-2">
                <div className="flex flex-col gap-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentServiceFilter === "all"
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentServiceFilter("all")}
                  >
                    All Services
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentServiceFilter === "ngo"
                        ? "bg-pink-100 text-pink-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentServiceFilter("ngo")}
                  >
                    NGOs
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentServiceFilter === "shelter"
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentServiceFilter("shelter")}
                  >
                    Shelters
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentServiceFilter === "training"
                        ? "bg-amber-100 text-amber-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentServiceFilter("training")}
                  >
                    Training Centers
                  </button>
                </div>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="bg-white rounded-lg shadow-lg">
              <button
                className="p-2 hover:bg-gray-100 border-b"
                onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                className="p-2 hover:bg-gray-100"
                onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* City Selection */}
            <div className="bg-white rounded-lg shadow-lg p-2">
              <select
                value={currentCity.name}
                onChange={(e) => {
                  const city = INDIAN_CITIES.find(
                    (c) => c.name === e.target.value
                  );
                  if (city) setCurrentCity(city);
                }}
                className="text-sm text-gray-600 outline-none"
              >
                {INDIAN_CITIES.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map Content */}
          <div className="absolute inset-0">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-gray-200"
                  style={{ left: `${(i / 12) * 100}%` }}
                />
              ))}
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-gray-200"
                  style={{ top: `${(i / 12) * 100}%` }}
                />
              ))}
            </div>

            {/* Neighborhoods */}
            {currentCity.neighborhoods.map((neighborhood) => {
              const itemsInArea = filteredItems.filter((item) => {
                if ("company" in item) {
                  return item.localArea === neighborhood.name;
                }
                return item.address.includes(neighborhood.name);
              });

              if (itemsInArea.length === 0) return null;

              return (
                <div
                  key={neighborhood.name}
                  className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-110 transition-transform"
                  style={{
                    top: `${neighborhood.top}%`,
                    left: `${neighborhood.left}%`,
                  }}
                  title={`${neighborhood.name}: ${itemsInArea.length} ${
                    activeType === "jobs" ? "jobs" : "services"
                  }`}
                >
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
                </div>
              );
            })}

            {/* Items (Jobs/Services) */}
            {filteredItems.map((item) => {
              const isJob = "company" in item;
              const location = isJob
                ? item.localArea || item.location
                : item.address;
              const neighborhood = currentCity.neighborhoods.find((n) =>
                location.includes(n.name)
              );

              if (!neighborhood) return null;

              return (
                <div
                  key={item.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    top: `${neighborhood.top}%`,
                    left: `${neighborhood.left}%`,
                  }}
                >
                  <MarkerCard
                    isSelected={selectedItem?.id === item.id}
                    serviceType={
                      !isJob ? ((item as NGOData).type as any) : undefined
                    }
                  >
                    <div className="p-3">
                      <div className="font-medium text-sm mb-1">
                        {isJob ? item.title : item.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {isJob ? item.company : item.type}
                      </div>
                      {isJob && (
                        <div className="text-xs text-gray-600 mt-1">
                          ₹{(item as JobData).salary}/month
                        </div>
                      )}
                      {!isJob && (
                        <div className="text-xs text-gray-600 mt-1">
                          {(item as NGOData).hours}
                        </div>
                      )}
                    </div>
                  </MarkerCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
