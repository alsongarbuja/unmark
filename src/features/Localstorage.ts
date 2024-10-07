import { BOOKMARKS_REMINDERS_LIST } from "../constants/localstorage"

export const getRemindersFromLS = (): BookmarkReminderObject => {
  const reminders = JSON.parse(localStorage.getItem(BOOKMARKS_REMINDERS_LIST) || "{}");
  return reminders;
}

export const addAllToLS = (reminders: BookmarkReminderObject, bookmarks: Bookmark[]) => {
  const lsReminders = getRemindersFromLS();
  const toRemoveReminders = Object.keys(lsReminders).filter((id) => {
    return !bookmarks.some((bookmark) => bookmark.id === id);
  });
  toRemoveReminders.forEach((id) => {
    delete lsReminders[id];
  });
  const updatedReminders = { ...lsReminders, ...reminders };
  localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(updatedReminders));
}


export const getReminderFromLSWithId = (id: string): IBookmarkReminder => {
  const reminders = getRemindersFromLS();
  const reminder = reminders[id];
  return reminder;
}

export const addReminderToLS = (id: string, remindIn: Date) => {
  const reminders = JSON.parse(localStorage.getItem(BOOKMARKS_REMINDERS_LIST) || "{}");
  reminders[id] = remindIn;
  localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(reminders));
}

export const deleteReminderInLS = (id: string) => {
  const reminders = getRemindersFromLS();
  delete reminders[id];
  localStorage.setItem(BOOKMARKS_REMINDERS_LIST, JSON.stringify(reminders));
}
