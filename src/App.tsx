import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { ArrowLeft, Sort, TickSquare } from "iconsax-react";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";

// UTILITIES
import { sortOptions } from "./utils/sort";

// FEATURE FUNCTIONS
import { getAllBookMarks } from "./features/Bookmark";
import {
  addAllRemindersToLocalStorage,
  getRemindersFromLocalStorage,
} from "./features/Localstorage";

// CONSTANTS
import { BOOKMARKS_SORT_ORDER } from "./constants/localstorage";

// COMPONENTS
import BookmarkTile from "./components/BookmarkTile";
import BookmarkFolder from "./components/BookmarkFolder";

// HELPER FUNCTIONS
import { sortBookmarks } from "./helpers/sortBookmarks";
import { deepFlatBookmark } from "./helpers/deepFlatBookmarks";
import { bookmarkChildrenFinder } from "./helpers/bookmarkFinder";
import { addLastUsedProperty } from "./helpers/addLastUsedProperty";
import { getNewAndUpdatedReminders } from "./helpers/updatedReminder";

function App() {
  const [currentBookMark, setCurrentBookMark] = useState<Bookmark>({
    id: "0",
    title: "All BookMarks",
  });
  const [reminders, setReminders] = useState<BookmarkReminderObject>({});
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([]);
  const [isSortPopOpen, setIsSortPopOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isSortPopOpen,
    placement: "bottom",
    middleware: [
      autoPlacement({
        allowedPlacements: ["left"],
      }),
    ],
  });
  const [sortBy, setSortBy] = useState<string>(
    localStorage.getItem(BOOKMARKS_SORT_ORDER) ?? "lastUsed"
  );

  const changeBookmarkLevel = (id: string) => {
    if (id === "0") {
      setBookmarks(allBookmarks);
      setCurrentBookMark({
        id: "0",
        title: "All BookMarks",
      });
      return;
    }
    const bookmarks = bookmarkChildrenFinder(id, allBookmarks);
    setCurrentBookMark(bookmarks ?? { id: "0", title: "All BookMarks" });
    setBookmarks(bookmarks ? (bookmarks.children as Bookmark[]) : []);
  };

  const updateReminder = (id: string, remindIn: Date | null) => {
    setReminders((prev) => {
      return { ...prev, [id]: { remindIn } };
    });
  };

  const deleteBookmarkFromState = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    const removeFromAllBookmarks = (b: Bookmark[]): Bookmark[] => {
      return b.filter((bookmark) => {
        if (bookmark.id === id) {
          return false;
        }
        if ("children" in bookmark) {
          bookmark.children = removeFromAllBookmarks(bookmark.children!);
        }
        return true;
      });
    };

    setAllBookmarks(removeFromAllBookmarks(allBookmarks));
  };

  useEffect(() => {
    (async () => {
      const bookmarks = await getAllBookMarks();
      const b: Bookmark[] = addLastUsedProperty(bookmarks[0].children!);
      const reminders = getRemindersFromLocalStorage();
      const newReminders = getNewAndUpdatedReminders(bookmarks, reminders);
      addAllRemindersToLocalStorage(newReminders, deepFlatBookmark(b));

      setReminders(getRemindersFromLocalStorage());
      setAllBookmarks(b);
      setBookmarks(b);
    })();
  }, []);

  useEffect(() => {
    (() => {
      const folders = bookmarks.filter((b) => "children" in b);
      const b = bookmarks.filter((b) => !("children" in b));

      const sortedFolders = sortBookmarks(folders, sortBy);
      const sortedB = sortBookmarks(b, sortBy);

      setBookmarks([...sortedFolders, ...sortedB]);
      localStorage.setItem(BOOKMARKS_SORT_ORDER, sortBy);
      setIsSortPopOpen(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBookMark, sortBy]);

  return (
    <main className="min-h-screen px-2 text-white bg-slate-800">
      <Toaster richColors position="bottom-center" />
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
        <div className="flex items-center gap-2">
          {currentBookMark.id !== "0" && (
            <button
              onClick={() =>
                changeBookmarkLevel(currentBookMark.parentId ?? "0")
              }
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h3 className="text-lg font-semibold">{currentBookMark.title}</h3>
        </div>
        <div className="flex items-end gap-1">
          <label htmlFor="sortby">Sort By</label>
          <button
            ref={refs.setReference}
            onClick={() => setIsSortPopOpen(true)}
          >
            <Sort size={20} />
          </button>
          {isSortPopOpen && (
            <>
              <div
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  padding: "0px",
                  marginInlineEnd: "1rem",
                  width: "max-content",
                }}
                className="z-20 flex flex-col rounded-md shadow-md bg-slate-900 min-w-32"
              >
                {sortOptions.map((sortOption, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSortBy(sortOption.value);
                    }}
                    className="flex items-center justify-start gap-2 px-4 py-2 text-white hover:bg-slate-400/40"
                  >
                    <span className="flex-1 text-start">
                      {sortOption.title}
                    </span>
                    {sortBy === sortOption.value ? (
                      <TickSquare
                        size={16}
                        variant="Bulk"
                        className="text-blue-200"
                      />
                    ) : (
                      <span className="w-8" />
                    )}
                  </button>
                ))}
              </div>
              <div
                className="fixed top-0 bottom-0 left-0 right-0 bg-black/10"
                onClick={() => setIsSortPopOpen(false)}
              ></div>
            </>
          )}
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
          return (
            <BookmarkTile
              bookmark={bookmark}
              key={bookmark.id}
              remindIn={reminders[bookmark.id].remindIn ?? null}
              updateReminder={updateReminder}
              deleteBookmarkFromState={deleteBookmarkFromState}
            />
          );
        })}
      </div>
    </main>
  );
}

export default App;
