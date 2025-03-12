
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, boolean>) => void;
  filterOptions?: { id: string; label: string }[];
}

const SearchFilter = ({ 
  onSearch, 
  onFilter,
  filterOptions = [
    { id: "jobs", label: "Jobs" },
    { id: "ngos", label: "NGOs" },
    { id: "shelters", label: "Shelters" },
    { id: "training", label: "Training" }
  ]
}: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>(
    filterOptions.reduce((acc, option) => ({ ...acc, [option.id]: false }), {})
  );

  // Call onSearch whenever searchQuery changes
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const handleFilterToggle = (filterId: string) => {
    const updatedFilters = {
      ...selectedFilters,
      [filterId]: !selectedFilters[filterId]
    };
    setSelectedFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none z-10">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full py-3 rounded-lg border border-border bg-white/80 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-200 pl-12 pr-12"
            style={{ minHeight: "46px", fontSize: "16px" }}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-3 rounded-lg ${isFilterOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'border border-border text-muted-foreground'} transition-colors shadow-sm`}
          aria-label="Filter"
        >
          <Filter size={20} />
        </button>
      </div>

      {isFilterOpen && (
        <div className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg animate-fade-in shadow-sm">
          {filterOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleFilterToggle(option.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilters[option.id] 
                  ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-sm' 
                  : 'bg-white border border-border hover:border-primary/30 hover:bg-primary/5 shadow-sm'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
