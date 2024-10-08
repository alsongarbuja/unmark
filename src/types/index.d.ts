interface IBookmarkReminder {
  remindIn: Date | null;
}

interface IBookmark extends chrome.bookmarks.BookmarkTreeNode {
  dateLastUsed?: number;
}

type Bookmark = IBookmark;
type BookmarkReminderObject = { [key: string]: IBookmarkReminder };
