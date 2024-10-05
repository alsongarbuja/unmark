
const extractBookmarks = (bookmarks: IBookmarkGroup[] | IBookmark[], extractedBookMarks: IBookmark[]) => {
  bookmarks.forEach((bookmark) => {
    if ("children" in bookmark) {
      extractBookmarks(bookmark.children, extractedBookMarks);
    } else {
      extractedBookMarks.push({
        ...bookmark,
        remindIn: null,
      });
    }
  });
}

export const getAllBookMarks = async () => {
  const bookmarks = await chrome.bookmarks.getTree();
  const extractedBookMarks: IBookmark[] = [];
  extractBookmarks(bookmarks as unknown as IBookmarkGroup[], extractedBookMarks);
  return extractedBookMarks;
}

export const addBookMark = async (title: string) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const bookmark = await chrome.bookmarks.create({
    parentId: "1",
    title: title ?? tabs[0].title,
    url: tabs[0].url,
  });
  return bookmark;
}

export const removeBookMark = async (id: string) => {
  await chrome.bookmarks.remove(id);
}
