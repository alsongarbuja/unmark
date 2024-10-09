import moment from "moment";
import { toast } from "sonner";
import { ArchiveSlash } from "iconsax-react";

import { cn } from "../helpers/cn";
import Notification from "./Notification";
import { removeBookMark } from "../features/Bookmark";
import { removeAlarm, setAlarm } from "../features/Notification";
import { BOOKMARKS_REMINDERS_LIST } from "../constants/localstorage";
import {
  deleteReminderInLocalStorage,
  getRemindersFromLocalStorage,
} from "../features/Localstorage";

interface IBookmarkTileProps {
  bookmark: Bookmark;
  remindIn: Date | null;
  updateReminder: (id: string, remindIn: Date | null) => void;
  deleteBookmarkFromState: (id: string) => void;
}

export default function BookmarkTile({
  bookmark,
  remindIn,
  updateReminder,
  deleteBookmarkFromState,
}: IBookmarkTileProps) {
  const deleteBookMark = async (id: string) => {
    deleteBookmarkFromState(id);
    await removeBookMark(id);
    deleteReminderInLocalStorage(id);
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
    const reminders = getRemindersFromLocalStorage();
    reminders[id] = { remindIn: remindDate };
    localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(reminders));

    updateReminder(id, remindDate);
    await setAlarm(title, url, remindIn);
    toast.success("Reminder added");
  };

  const removeReminder = async (id: string, bookmarkId: string) => {
    const reminders = getRemindersFromLocalStorage();
    reminders[id] = { remindIn: null };
    localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(reminders));

    updateReminder(bookmarkId, null);
    await removeAlarm(id);
    toast.info("Reminder cancelled");
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
        className="inline-flex items-center flex-1 gap-2"
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
          alt={`${bookmark.title}`}
          className="w-8 h-8 p-2 rounded-md bg-slate-900"
        />
        <p className="flex flex-col gap-2">
          <p className={cn("", remindIn && "text-sm")}>{bookmark.title}</p>
          <span className="font-semibold text-red-400">
            {remindIn && <>{moment(remindIn).fromNow()}</>}
          </span>
        </p>
      </a>

      <div className="flex items-center gap-2">
        <Notification
          hasReminder={!!remindIn}
          bookmark={bookmark}
          addReminder={addReminder}
          removeReminder={removeReminder}
        />
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
