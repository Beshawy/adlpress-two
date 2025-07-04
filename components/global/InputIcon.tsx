import React, { ReactNode, useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchProducts } from "@/lib/api";
import { useRouter } from "next/navigation";

type InputWithIconProps = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
};

const InputWithIcon = ({
  className,
  startIcon,
  endIcon,
}: InputWithIconProps) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  let debounceTimeout = useRef<any>(null);

  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      setNoResults(false);
      return;
    }
    setLoading(true);
    setNoResults(false);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      const results = await searchProducts(value);
      setSuggestions(results);
      setLoading(false);
      setNoResults(results.length === 0);
      setShowSuggestions(true);
    }, 400);
    return () => clearTimeout(debounceTimeout.current);
  }, [value]);

  const handleSelect = (item: any) => {
    setShowSuggestions(false);
    setValue("");
    if (item && item._id) {
      router.push(`/products/${item._id}`);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } else if (value) {
        router.push(`/search?query=${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <div className={cn("relative md:w-full h-10", className)}>
      <span className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {startIcon || null}
      </span>
      <Input
        ref={inputRef}
        placeholder="Search..."
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        className="py-3 md:py-7 absolute top-1/2 transform -translate-y-1/2  px-10 text-gray-800"
      />
      <span className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {endIcon || null}
      </span>
      {showSuggestions && (
        <div className="absolute left-0 right-0 z-[100] bg-white border border-gray-200 rounded-b-lg shadow-lg mt-8 max-h-72 overflow-auto">
          {loading && (
            <div className="p-4 text-center text-gray-400">جاري البحث...</div>
          )}
          {!loading && noResults && (
            <div className="p-4 text-center text-gray-400">لا توجد نتائج</div>
          )}
          {!loading && suggestions.map((item, idx) => (
            <div
              key={item._id || idx}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-primary/10 border-b last:border-b-0"
              onMouseDown={() => handleSelect(item)}
            >
              <img src={item.image?.[0]?.url} alt={item.title?.ar} className="w-10 h-10 object-cover rounded" />
              <div>
                <div className="font-bold text-sm">{item.title?.ar || item.title?.en}</div>
                <div className="text-xs text-gray-500">{item.price} ج.م</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputWithIcon;
