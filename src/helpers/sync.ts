import { BOOKMARKS_LIST } from "../constants/localstorage";
import { getAllBookMarksFromLocalStorage } from "../features/Localstorage";

export const syncBookmarks = async (latestBookMarks: IBookmark[]) => {
  const bookmarks = getAllBookMarksFromLocalStorage();
  const newBookmarks = latestBookMarks.filter((latestBookmark) => {
    return !bookmarks.find((bookmark: IBookmark) => bookmark.id === latestBookmark.id);
  });

  const syncedBookmarks = [...bookmarks, ...newBookmarks.map((bookmark) => ({ ...bookmark, remindIn: null }))];

  localStorage.setItem(BOOKMARKS_LIST, JSON.stringify(syncedBookmarks));
}
