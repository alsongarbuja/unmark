import { useCallback, useEffect, useState } from "react";
import moment from "moment";

function App() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [sortBy, setSortBy] = useState<"dateAdded" | "lastUsed">("dateAdded");

  const sortBookmarks = useCallback(() => {
    setBookmarks((prev) =>
      prev.sort((a, b) => {
        if (sortBy === "dateAdded") {
          return b.dateAdded - a.dateAdded;
        } else {
          return b.dateLastUsed - a.dateLastUsed;
        }
      })
    );
  }, [sortBy]);

  const extractBookmark = useCallback(
    (bookmarks: IBookmarkGroup[] | IBookmark[]) => {
      bookmarks.forEach((bookmark) => {
        if ("children" in bookmark) {
          extractBookmark(bookmark.children);
        } else {
          setBookmarks((prev) => [...prev, bookmark as IBookmark]);
        }
      });
      sortBookmarks();
    },
    [sortBookmarks]
  );

  const getBookMarks = useCallback(async () => {
    const bookmarks = await chrome.bookmarks.getTree();
    if (bookmarks.length === 0) {
      return;
    }
    extractBookmark(bookmarks as unknown as IBookmarkGroup[]);
  }, [extractBookmark]);

  useEffect(() => {
    getBookMarks();
  }, [getBookMarks]);

  const addBookMark = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.bookmarks.create({
        parentId: "1",
        title: tabs[0].title,
        url: tabs[0].url,
      });
    });
  };

  return (
    <main className="bg-slate-900 text-white py-2 px-4 min-w-80">
      <h1>UnMark</h1>
      <div className="flex flex-col items-start gap-1">
        <label htmlFor="sortby">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "dateAdded" | "lastUsed")
          }
          className="border rounded-md p-1 w-full text-black"
        >
          <option value="dateAdded">Date Added</option>
          <option value="lastUsed">Last Used</option>
        </select>
      </div>
      <ul className="mt-4">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="flex items-center justify-between px-1 py-2 my-2 border rounded-md"
          >
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>
            ({moment(bookmark.dateLastUsed).fromNow()})
          </li>
        ))}
      </ul>
      <button onClick={addBookMark}>Add Bookmark</button>
    </main>
  );
}

export default App;
