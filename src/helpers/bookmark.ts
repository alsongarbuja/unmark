/**
 *
 * Get all bookmarks
 *
 * @returns List of Bookmark
 */
export const getBookmarks = async () => {
  const bookmarks = await chrome.bookmarks.getTree();
  return bookmarks;
};

/**
 *
 * Get the bookmark by id
 * @param id {string}
 *
 * @returns Bookmark
 */
export const getBookmarkById = async (id: string) => {
  const bookmark = await chrome.bookmarks.get(id);
  return bookmark;
};

/**
 *
 * Get children of the Bookmark
 * @param id {string}
 * @returns List of Bookmarks
 */
export const getBookmarkChildrens = (
  id: string,
  allBookmarks: Bookmark[]
): Bookmark | undefined => {
  const bookmark = allBookmarks.find((b) => b.id === id);
  if (bookmark) return bookmark as Bookmark;

  for (const b of allBookmarks) {
    if (b.children) {
      const bm = getBookmarkChildrens(id, b.children as Bookmark[]);
      if (bm) return bm as Bookmark;
      else continue;
    }
  }

  return undefined;
};

/**
 *
 * Create new bookmark
 * @param parentId {string}
 * @param title {string}
 * @param url {string}
 * @returns Bookmark
 */
export const createBookmark = async (
  parentId: string,
  title: string,
  url: string
) => {
  const bookmark = await chrome.bookmarks.create({
    parentId,
    title,
    url,
  });
  return bookmark;
};

/**
 *
 * Updates a bookmark by its Id
 * @param id {string}
 * @param title {string}
 * @param url {string}
 * @returns Updated Bookmark
 */
export const updateBookmark = async (
  id: string,
  title: string,
  url: string
) => {
  // Check if the bookmark is present or not
  const updatedBookmark = await chrome.bookmarks.update(id, {
    title,
    url,
  });
  return updatedBookmark;
};

/**
 *
 * Removes a bookmark by Id
 * @param id {string}
 */
export const removeBookmark = async (id: string) => {
  await chrome.bookmarks.remove(id);
};
