import moment from "moment";
import { useEffect, useState } from "react";
import { ArchiveSlash, Timer1 } from "iconsax-react";

import { syncBookmarks } from "./helpers/sync";
import { getAllBookMarks, removeBookMark } from "./features/Bookmark";
import { deleteBookMarkFromLocalStorage } from "./features/Localstorage";
import { setAlarm } from "./features/Notification";

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

  const addReminderToBookmark = async (
    title: string,
    url: string,
    remindIn: number,
    id: string
  ) => {
    await setAlarm(title, url, remindIn);
    setBookmarks((prev) =>
      prev.map((bookmark) => {
        if (bookmark.id === id) {
          return {
            ...bookmark,
            remindIn: Date.now() + remindIn,
          };
        }
        return bookmark;
      })
    );
  };

  useEffect(() => {
    chrome.alarms.onAlarm.addListener((alarm) => {
      const [, title] = alarm.name.split("*_*");
      chrome.notifications.create(alarm.name, {
        title: "Unmark - Reminder",
        message: `Time to visit ( ${title} ) bookmark`,
        type: "basic",
        iconUrl: "/icons/unmark-icon-32x32.png",
        buttons: [
          {
            title: "Open Bookmark",
          },
          { title: "Snooze 5 minutes" },
        ],
      });
    });
    chrome.notifications.onButtonClicked.addListener(
      (notificationId, buttonIndex) => {
        const [url, title] = notificationId.split("*_*");
        if (buttonIndex === 0) {
          chrome.tabs.create({ url });
        } else {
          setAlarm(title, url, 5 * 60);
        }
      }
    );

    (async () => {
      const bookmarks = await getAllBookMarks();
      setBookmarks(bookmarks);
      syncBookmarks(bookmarks);
    })();
  }, []);

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
              <span
                className="text-blue-500 cursor-pointer"
                title="Add reminder"
                onClick={() =>
                  addReminderToBookmark(
                    bookmark.title,
                    bookmark.url,
                    10,
                    bookmark.id
                  )
                }
              >
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
