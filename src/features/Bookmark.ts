export const getAllBookMarks = async () => {
  const bookmarks = await chrome.bookmarks.getTree();
  return bookmarks;
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

export const addFolder = async (title: string, parentId: string) => {
  const folder = await chrome.bookmarks.create({
    parentId,
    title,
  });
  return folder;
}
