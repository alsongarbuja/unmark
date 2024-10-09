import { BOOKMARKS_REMINDERS_LIST } from "../constants/localstorage"

export const getRemindersFromLocalStorage = (): BookmarkReminderObject => {
  const reminders = JSON.parse(localStorage.getItem(BOOKMARKS_REMINDERS_LIST) || "{}");
  return reminders;
}

export const addAllRemindersToLocalStorage = (reminders: BookmarkReminderObject, bookmarks: Bookmark[]) => {
  const lsReminders = getRemindersFromLocalStorage();
  const toRemoveReminders = Object.keys(lsReminders).filter((id) => {
    return !bookmarks.some((bookmark) => bookmark.id === id);
  });
  toRemoveReminders.forEach((id) => {
    delete lsReminders[id];
  });
  const updatedReminders = { ...lsReminders, ...reminders };
  localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(updatedReminders));
}

export const getReminderFromLocalStorageWithId = (id: string): IBookmarkReminder => {
  const reminders = getRemindersFromLocalStorage();
  const reminder = reminders[id];
  return reminder;
}

export const deleteReminderInLocalStorage = (id: string) => {
  const reminders = getRemindersFromLocalStorage();
  delete reminders[id];
  localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(reminders));
}
