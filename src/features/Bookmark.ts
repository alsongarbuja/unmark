/*
 * Get all the bookmarks user have
 * @Returns bookmarks: BookmarkTreeNode[]
 */
export const getAllBookMarks = async () => {
  const bookmarks = await chrome.bookmarks.getTree();
  return bookmarks;
}

/*
 * Get bookmark with the given id
 * @Param id: string
 * @Returns bookmark: BookmarkTreeNode
 */
export const getBookMark = async (id: string) => {
  const bookmark = await chrome.bookmarks.get(id);
  return bookmark;
}

/*
 * Get the children of the bookmark with the given id
 * @Param id: string
 * @Returns childrens: BookmarkTreeNode[]
 */
export const getChildren = async (id: string) => {
  const childrens = await chrome.bookmarks.getChildren(id);
  return childrens;
}

/*
 * Add bookmark in the specified folder
 * @Param title: string & parentId: string
 * @Returns bookmark: BookmarkTreeNode
 */
export const addBookMark = async (title: string, parentId: string) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  let bookmarkObj: dynamicObject = {
    parentId,
    title: title ?? tabs[0].title,
  }
  const bookmark = await chrome.bookmarks.create(bookmarkObj);
  return {
    ...bookmark,
    children: [],
  };
}

/*
 * Create a folder
 * @Param title: string & parentId?: string
 * @Returns folder: BookmarkTreeNode
 */
export const createFolder = async (title: string, parentId: string) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  let folder = {
    parentId,
    title: title ?? tabs[0].title,
    url: tabs[0].url,
  }
  return await chrome.bookmarks.create(folder);
}

/*
 * Deletes the bookmark with given id
 * @Param id: string
 */
export const removeBookMark = async (id: string) => {
  await chrome.bookmarks.remove(id);
}

/*
 * Deletes the folder with given id while also removing the contents recursively
 * @Param id: string
 */
export const removeFolder = async (id: string) => {
  await chrome.bookmarks.removeTree(id);
}

/*
 * Move the bookmark to another folder
 * @Params id: string & parentId: string
 */
export const moveBookmark = async (id: string, parentId: string) => {
  await chrome.bookmarks.move(id, { parentId });
}


/*
 * Search bookmarks with given query
 * @Params query: string
 * @Returns bookmarks: BookmarkTreeNode[]
 */
export const searchBookmark = async (query: string) => {
  const bookmarks = await chrome.bookmarks.search(query);
  return bookmarks;
}




