import { BOOKMARKS_LIST } from "../constants/localstorage"

export const addAllBookMarksToLocalStorage = (bookmarks: IBookmark[]) => {
  localStorage.setItem(BOOKMARKS_LIST, JSON.stringify(bookmarks));
  return bookmarks;
}

export const getAllBookMarksFromLocalStorage = () => {
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_LIST) || "[]");
  return bookmarks;
}

export const addBookMarkToLocalStorage = (bookmark: IBookmark) => {
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_LIST) || "[]");
  bookmarks.push(bookmark);
  localStorage.setItem(BOOKMARKS_LIST, JSON.stringify(bookmarks));
  return bookmarks;
}

export const deleteBookMarkFromLocalStorage = (id: string) => {
  const bookmarks = getAllBookMarksFromLocalStorage();
  const newBookmarks = bookmarks.filter((bookmark: IBookmark) => bookmark.id !== id);
  localStorage.setItem(BOOKMARKS_LIST, JSON.stringify(newBookmarks));
}
