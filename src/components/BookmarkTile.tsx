import moment from "moment";
import { ArchiveSlash } from "iconsax-react";

import Notification from "./Notification";
import { setAlarm } from "../features/Notification";
import { removeBookMark } from "../features/Bookmark";
import {
  deleteReminderInLS,
  getRemindersFromLS,
} from "../features/Localstorage";
import { BOOKMARKS_REMINDERS_LIST } from "../constants/localstorage";
import { toast } from "sonner";

interface IBookmarkTileProps {
  bookmark: Bookmark;
  remindIn: Date | null;
  updateReminder: (id: string, remindIn: Date) => void;
}

export default function BookmarkTile({
  bookmark,
  remindIn,
  updateReminder,
}: IBookmarkTileProps) {
  const deleteBookMark = async (id: string) => {
    await removeBookMark(id);
    deleteReminderInLS(id);
    toast.info("Bookmark removed");
  };

  const addReminder = async (
    id: string,
    title: string,
    url: string,
    remindIn: number
  ) => {
    const remindDate = moment()
      .add(remindIn * 60, "seconds")
      .toDate();
    const reminders = getRemindersFromLS();
    reminders[id] = { remindIn: remindDate };

    localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(reminders));

    updateReminder(id, remindDate);
    await setAlarm(title, url, remindIn);

    toast.success("Reminder added");
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
          className="w-8 h-8 p-2 rounded-md bg-slate-900"
        />
        <span>{bookmark.title}</span>
      </a>

      <div className="flex items-center gap-2">
        {remindIn && <>({moment(remindIn).fromNow()})</>}
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
