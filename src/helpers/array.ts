export const deepFlatBookmark = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.flatMap((bookmark) => {
    if (bookmark.children) {
      return [bookmark, ...deepFlatBookmark(bookmark.children as Bookmark[])];
    }
    return bookmark;
  });
}
