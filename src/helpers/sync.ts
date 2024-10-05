import { BOOKMARKS_LIST } from "../constants/localstorage";
import { getAllBookMarksFromLocalStorage } from "../features/Localstorage";

export const syncBookmarks = async (latestBookmarks: IBookmark[], checkReminder: boolean = false) => {
  const localstorageBookmark = getAllBookMarksFromLocalStorage();
  const newBookmarks = latestBookmarks.filter((lb) => {
    return !localstorageBookmark.find((b) => b.id === lb.id);
  });
  const toRemoveBookmarks = localstorageBookmark.filter((b) => {
    return !latestBookmarks.find((lb) => lb.id === b.id);
  });
  const remainingBookmarks = localstorageBookmark.filter((b) => {
    return !toRemoveBookmarks.find((toRemoveBookmark) => toRemoveBookmark.id === b.id);
  });

  if (checkReminder) {
    const reminderUpdatedBookmarks = remainingBookmarks.map((rb) => {
      const lbRemindIn = latestBookmarks.find((lb) => lb.id === rb.id)?.remindIn;
      if (lbRemindIn !== rb.remindIn) {
        return {
          ...rb,
          remindIn: lbRemindIn ?? null,
        }
      }
      return rb;
    })
    const syncedBookmarks = [...reminderUpdatedBookmarks, ...newBookmarks.map((bookmark) => ({ ...bookmark, remindIn: null }))];
    localStorage.setItem(BOOKMARKS_LIST, JSON.stringify(syncedBookmarks));
    return syncedBookmarks;
  }

  const syncedBookmarks = [...remainingBookmarks, ...newBookmarks.map((bookmark) => ({ ...bookmark, remindIn: null }))];
  localStorage.setItem(BOOKMARKS_LIST, JSON.stringify(syncedBookmarks));

  return syncedBookmarks;
}
