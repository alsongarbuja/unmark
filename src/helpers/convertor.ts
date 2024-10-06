import moment from "moment";
import { getRemindersFromLS } from "../features/Localstorage";

export const getNewAndUpdatedReminders = (bookmarks: IBookmark[]) => {
  let reminders: BookmarkReminderObject = {};
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].children) {
      const childrenReminders = getNewAndUpdatedReminders(bookmarks[i].children!);
      reminders = { ...reminders, ...childrenReminders };
    } else {
      if (checkIfReminderExists(bookmarks[i].id) && checkIfReminderStale(bookmarks[i].id)) {
        const { id } = bookmarks[i];
        reminders[id] = { remindIn: null };
      }
    }
  }

  return reminders;
}

const checkIfReminderExists = (id: string) => {
  const reminders = getRemindersFromLS();
  return reminders[id] ? true : false;
}

export const checkIfReminderStale = (id: string) => {
  const reminders = getRemindersFromLS();
  const remindInDate = reminders[id].remindIn;
  if (!remindInDate) return false;
  return moment().isBefore(remindInDate);
}
