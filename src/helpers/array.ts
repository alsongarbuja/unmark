export const deepFlatBookmark = (bookmarks: Bookmark[]): Bookmark[] => {
  return bookmarks.flatMap((bookmark) => {
    if (bookmark.children) {
      return [bookmark, ...deepFlatBookmark(bookmark.children as Bookmark[])];
    }
    return bookmark;
  });
}

export const sortBookmarks = (bookmarks: Bookmark[], sortOrder: string): Bookmark[] => {
  return bookmarks.sort((a, b) => {
    switch (sortOrder) {
      case "lastUsed":
        return b.dateLastUsed! - a.dateLastUsed!;
      case "dateAddedNewest":
        return b.dateAdded! - a.dateAdded!;
      case "dateAddedOldest":
        return a.dateAdded! - b.dateAdded!;
      case "alpha":
        return a.title.localeCompare(b.title);
      case "alphaReverse":
        return b.title.localeCompare(a.title);
      default:
        return b.dateLastUsed! - a.dateLastUsed!;
    }
  });
}
