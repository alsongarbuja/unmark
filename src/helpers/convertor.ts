import moment from "moment";
import { getReminderFromLSWithId } from "../features/Localstorage";

export const getNewAndUpdatedReminders = (bookmarks: IBookmark[]) => {
  let reminders: BookmarkReminderObject = {};
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].children) {
      const childrenReminders = getNewAndUpdatedReminders(bookmarks[i].children!);
      reminders = { ...reminders, ...childrenReminders };
    } else {
      if (!checkIfReminderExists(bookmarks[i].id) || checkIfReminderStale(bookmarks[i].id)) {
        const { id } = bookmarks[i];
        reminders[id] = { remindIn: null };
      }
    }
  }

  return reminders;
}

const checkIfReminderExists = (id: string) => {
  const reminder = getReminderFromLSWithId(id);
  return !!reminder;
}

export const checkIfReminderStale = (id: string) => {
  if (!checkIfReminderExists(id)) {
    return false;
  }
  const reminder = getReminderFromLSWithId(id);
  const remindInDate = moment(reminder.remindIn);
  return moment().isAfter(remindInDate);
}
