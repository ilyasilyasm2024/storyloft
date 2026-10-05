import { SearchIcon } from "./Icons.jsx";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block">
      <span className="sr-only">ابحث عن قصة</span>
      <SearchIcon className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-stone-400" />
      {/* text-base (16px) prevents iOS Safari from zooming in on focus */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث بالعنوان أو الكاتب أو الوسم…"
        className="w-full rounded-2xl border border-stone-200 bg-white py-3 ps-11 pe-4 text-base shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 dark:border-stone-800 dark:bg-stone-900"
      />
    </label>
  );
}
