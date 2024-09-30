// import moment from "moment";
import { ArchiveSlash, Timer1 } from "iconsax-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [sortBy, setSortBy] = useState<"dateAdded" | "lastUsed">("dateAdded");

  const extractBookmark = useCallback(
    (bookmarks: IBookmarkGroup[] | IBookmark[]) => {
      bookmarks.forEach((bookmark) => {
        if ("children" in bookmark) {
          extractBookmark(bookmark.children);
        } else {
          setBookmarks((prev) => [
            ...prev,
            {
              ...bookmark,
              remindIn: null,
            },
          ]);
        }
      });
    },
    []
  );

  const sortBookmarks = (sortBy: "dateAdded" | "lastUsed") => {
    console.log(bookmarks);

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

  useEffect(() => {
    const getBookMarks = async () => {
      const bookmarks = await chrome.bookmarks.getTree();
      if (bookmarks.length === 0) {
        return;
      }
      extractBookmark(bookmarks as unknown as IBookmarkGroup[]);
    };

    getBookMarks();
  }, [extractBookmark]);

  // const addBookMark = () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     chrome.bookmarks.create({
  //       parentId: "1",
  //       title: tabs[0].title,
  //       url: tabs[0].url,
  //     });
  //   });
  // };

  // const addReminderToBookmark = (id: string, remindIn: number) => {
  //   const date = new Date();
  //   date.setMilliseconds(date.getMilliseconds() + remindIn);
  //   const remindDate = remindIn === 0 ? null : date.getTime();
  //   setBookmarks((prev) =>
  //     prev.map((bookmark) =>
  //       bookmark.id === id ? { ...bookmark, remindIn: remindDate } : bookmark
  //     )
  //   );
  // };

  const deleteBookMark = (id: string) => {
    chrome.bookmarks.remove(id);
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <main className="min-w-[400px]">
      <div className="flex items-center justify-start gap-4 px-4 py-8 text-white bg-slate-800">
        <img
          src="/icons/unmark-icon-32x32.png"
          alt="unmark icon"
          className="rounded-md"
        />
        <h1 className="text-2xl font-semibold">Unmark</h1>
      </div>
      <div className="flex flex-col items-start gap-1 px-4 py-2">
        <label htmlFor="sortby">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => {
            const sort = e.target.value as "dateAdded" | "lastUsed";
            setSortBy(sort);
            sortBookmarks(sort);
          }}
          className="w-full p-1 text-black border rounded-md"
        >
          <option value="dateAdded">Date Added</option>
          <option value="lastUsed">Last Used</option>
        </select>
      </div>
      <div className="px-4 mt-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between px-1 py-2 my-2 border rounded-md"
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
              <span className="text-blue-500">
                <Timer1 variant="Bulk" size={20} />
              </span>
              <button
                className="text-red-500"
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
