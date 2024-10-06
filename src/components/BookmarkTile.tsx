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
      className="flex items-center justify-between px-4 py-2 text-white hover:bg-slate-400/40"
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2"
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
          alt={`${bookmark.title}`}
          className="p-2 rounded-md bg-slate-900"
        />
        <span>{bookmark.title}</span>
      </a>

      <div className="flex items-center gap-2">
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
