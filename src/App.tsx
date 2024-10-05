import moment from "moment";
import { useEffect, useState } from "react";
import { ArchiveSlash } from "iconsax-react";

// import { syncBookmarks } from "./helpers/sync";
import Notification from "./components/Notification";
import { getAllBookMarks, removeBookMark } from "./features/Bookmark";
import { deleteBookMarkFromLocalStorage } from "./features/Localstorage";
import { setAlarm } from "./features/Notification";
import { syncBookmarks } from "./helpers/sync";

function App() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [sortBy, setSortBy] = useState<"dateAdded" | "lastUsed">("dateAdded");

  const sortBookmarks = (sortBy: "dateAdded" | "lastUsed") => {
    setBookmarks((prev) =>
      prev.sort((a, b) => {
        if (sortBy === "dateAdded") {
          return a.dateAdded - b.dateAdded;
        } else {
          return a.dateLastUsed - b.dateLastUsed;
        }
      })
    );
  };

  const deleteBookMark = async (id: string) => {
    await removeBookMark(id);
    deleteBookMarkFromLocalStorage(id);
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const addReminder = async (
    id: string,
    title: string,
    url: string,
    remindIn: number
  ) => {
    const updatedBookmarks = bookmarks.map((bookmark) => {
      if (bookmark.id === id) {
        return {
          ...bookmark,
          remindIn: new Date(Date.now() + remindIn * 1000 * 60),
        };
      }
      return bookmark;
    });
    setBookmarks(await syncBookmarks(updatedBookmarks, true));
    await setAlarm(title, url, remindIn);
  };

  useEffect(() => {
    (async () => {
      const bookmarks = await getAllBookMarks();
      const syncedBookmarks = await syncBookmarks(bookmarks);
      setBookmarks(syncedBookmarks);
    })();
  }, []);

  return (
    <main className="px-2 text-white bg-slate-800">
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
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between p-2 text-white hover:bg-slate-400/40"
          >
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>

            <div className="flex items-center gap-2">
              {/* <div className="flex flex-col items-start gap-1">
                <select
                  onChange={(e) => {
                    const remindIn = e.target.value;
                    addReminderToBookmark(bookmark.id, Number(remindIn));
                  }}
                  className="w-full p-1 text-black border rounded-md"
                >
                  <option value={0}>None</option>
                  <option value={60000}>1 Minute</option>
                  <option value={300000}>5 Minutes</option>
                  <option value={600000}>10 Minutes</option>
                  <option value={1800000}>30 Minutes</option>
                  <option value={3600000}>1 Hour</option>
                </select>
              </div> */}
              {bookmark.remindIn && (
                <>({moment(bookmark.remindIn).fromNow()})</>
              )}
              <Notification bookmark={bookmark} addReminder={addReminder} />
              <button
                className="text-red-600"
                onClick={() => deleteBookMark(bookmark.id)}
              >
                <span title="unmark">
                  <ArchiveSlash variant="Bulk" size={20} />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
