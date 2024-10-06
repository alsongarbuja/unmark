import { useEffect, useState } from "react";

import { addAllToLS } from "./features/Localstorage";
import { getAllBookMarks } from "./features/Bookmark";
import BookmarkFolder from "./components/BookmarkFolder";
import { getNewAndUpdatedReminders } from "./helpers/convertor";
import BookmarkTile from "./components/BookmarkTile";
import { bookmarkChildrenFinder } from "./helpers/bookmarkFinder";
import { ArrowLeft } from "iconsax-react";

function App() {
  const [currentBookMark, setCurrentBookMark] = useState<Bookmark>({
    id: "0",
    title: "All BookMarks",
    remindIn: null,
  });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([]);
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

  const changeBookmarkLevel = (id: string) => {
    if (id === "0") {
      setBookmarks(allBookmarks);
      setCurrentBookMark({
        id: "0",
        title: "All BookMarks",
        remindIn: null,
      });
      return;
    }
    const bookmarks = bookmarkChildrenFinder(id, allBookmarks);
    setCurrentBookMark(
      bookmarks ?? { id: "0", title: "All BookMarks", remindIn: null }
    );
    setBookmarks(bookmarks ? (bookmarks.children as Bookmark[]) : []);
  };

  useEffect(() => {
    (async () => {
      const bookmarks = await getAllBookMarks();
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
      setAllBookmarks(b);
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
      <input
        type="text"
        placeholder="Search Bookmark"
        className="w-full p-3 my-2 text-gray-800 rounded-full bg-slate-400 placeholder:text-gray-800"
      />
      <div className="flex items-center justify-between gap-2 py-2">
        {currentBookMark.id !== "0" && (
          <button
            onClick={() => changeBookmarkLevel(currentBookMark.parentId ?? "0")}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h3 className="text-lg font-semibold">{currentBookMark.title}</h3>
        <div className="flex items-end gap-1">
          <label htmlFor="sortby">Sort in</label>
          <select
            value={sortBy}
            onChange={(e) => {
              const sort = e.target.value as "dateAdded" | "lastUsed";
              setSortBy(sort);
              sortBookmarks(sort);
            }}
            className="p-1 text-black rounded-full w-min bg-slate-400"
          >
            <option value="dateAdded">Date Added</option>
            <option value="lastUsed">Last Used</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        {bookmarks.map((bookmark) => {
          if (bookmark.children) {
            return (
              <BookmarkFolder
                onClick={changeBookmarkLevel}
                bookmark={bookmark}
                key={bookmark.id}
              />
            );
          }
          return <BookmarkTile bookmark={bookmark} key={bookmark.id} />;
        })}
      </div>
    </main>
  );
}

export default App;
