import moment from "moment";

export const getNewAndUpdatedReminders = (bookmarks: Bookmark[], oldReminders: BookmarkReminderObject) => {
  let reminders: BookmarkReminderObject = {};
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].children) {
      const childrenReminders = getNewAndUpdatedReminders(bookmarks[i].children!, oldReminders);
      reminders = { ...reminders, ...childrenReminders };
    } else {
      const { id } = bookmarks[i];
      const oldReminderExists = oldReminders[id];
      const oldReminderDateStale = oldReminderExists && moment().isAfter(moment(oldReminders[id].remindIn));
      if (!oldReminderExists || oldReminderDateStale) {
        const { id } = bookmarks[i];
        reminders[id] = { remindIn: null };
      }
    }
  }

  return reminders;
}
