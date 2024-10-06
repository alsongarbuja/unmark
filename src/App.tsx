import { useEffect, useState } from "react";

import { addAllToLS } from "./features/Localstorage";
import { getAllBookMarks } from "./features/Bookmark";
import BookmarkFolder from "./components/BookmarkFolder";
import { getNewAndUpdatedReminders } from "./helpers/convertor";

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [sortBy, setSortBy] = useState<"dateAdded" | "lastUsed">("dateAdded");

  const sortBookmarks = (sortBy: "dateAdded" | "lastUsed") => {
    setBookmarks((prev) =>
      prev.sort((a, b) => {
        if (sortBy === "dateAdded") {
          return a.dateAdded! - b.dateAdded!;
        } else {
          return a.dateLastUsed! - b.dateLastUsed!;
        }
      })
    );
  };

  useEffect(() => {
    (async () => {
      const bookmarks = await getAllBookMarks();
      console.log(bookmarks);

      const b: Bookmark[] = bookmarks[0].children!.map(
        (bookmark: IBookmark) => {
          return {
            ...bookmark,
            dateLastUsed: bookmark.dateAdded,
            remindIn: null,
          };
        }
      );
      const reminders = getNewAndUpdatedReminders(bookmarks);
      addAllToLS(reminders);
      setBookmarks(b);
    })();
  }, []);

  return (
    <main className="min-h-screen px-2 text-white bg-slate-800">
      <div className="flex items-center justify-start gap-4 py-6">
        <img
          src="/icons/unmark-icon-32x32.png"
          alt="unmark icon"
          className="rounded-md"
        />
        <h1 className="text-2xl font-semibold">Unmark</h1>
      </div>
      <div className="flex items-center gap-2 py-2">
        <input
          type="text"
          placeholder="Search Bookmark"
          className="w-full p-3 text-gray-800 rounded-full bg-slate-400 placeholder:text-gray-800"
        />
        <div className="flex flex-col items-start gap-1">
          <label htmlFor="sortby">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => {
              const sort = e.target.value as "dateAdded" | "lastUsed";
              setSortBy(sort);
              sortBookmarks(sort);
            }}
            className="w-full p-1 text-black border rounded-full bg-slate-400"
          >
            <option value="dateAdded">Date Added</option>
            <option value="lastUsed">Last Used</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        {bookmarks.map((bookmark) => {
          return <BookmarkFolder bookmark={bookmark} key={bookmark.id} />;
        })}
      </div>
    </main>
  );
}

export default App;
