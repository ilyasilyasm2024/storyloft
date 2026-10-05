import { Link } from "react-router";

export default function NotFound({ message = "هذه الصفحة غير موجودة." }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl">📖</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold">تُهت بين الصفحات</h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400">{message}</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white dark:bg-amber-400 dark:text-stone-950">
        العودة إلى القصص
      </Link>
    </div>
  );
}
