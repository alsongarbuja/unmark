import moment from "moment";
import { ArchiveSlash } from "iconsax-react";

import Notification from "./Notification";
import { setAlarm } from "../features/Notification";
import { removeBookMark } from "../features/Bookmark";
import { deleteReminderInLS } from "../features/Localstorage";

interface IBookmarkTileProps {
  bookmark: Bookmark;
}

export default function BookmarkTile({ bookmark }: IBookmarkTileProps) {
  const deleteBookMark = async (id: string) => {
    await removeBookMark(id);
    deleteReminderInLS(id);
  };

  const addReminder = async (
    id: string,
    title: string,
    url: string,
    remindIn: number
  ) => {
    console.log(id);
    // TODO: Add reminder to bookmark
    // const updatedBookmarks = bookmarks.map((bookmark) => {
    //   if (bookmark.id === id) {
    //     return {
    //       ...bookmark,
    //       remindIn: new Date(Date.now() + remindIn * 1000 * 60),
    //     };
    //   }
    //   return bookmark;
    // });
    // setBookmarks(await syncBookmarks(updatedBookmarks, true));
    await setAlarm(title, url, remindIn);
  };

  return (
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
        {bookmark.remindIn && <>({moment(bookmark.remindIn).fromNow()})</>}
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
  );
}
