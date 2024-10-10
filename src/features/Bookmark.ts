export const getAllBookMarks = async () => {
  const bookmarks = await chrome.bookmarks.getTree();
  return bookmarks;
}

export const addBookMark = async (title: string, parentId: string, isFolder: boolean = false) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  let bookmarkObj: dynamicObject = {
    parentId,
    title: title ?? tabs[0].title,
  }
  if (!isFolder) {
    bookmarkObj = {
      ...bookmarkObj,
      url: tabs[0].url,
    }
  }
  const bookmark = await chrome.bookmarks.create(bookmarkObj);
  return {
    ...bookmark,
    children: [],
  };
}

export const removeBookMark = async (id: string) => {
  await chrome.bookmarks.remove(id);
}
