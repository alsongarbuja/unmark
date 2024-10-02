
export const addNotificationToBookmark = async (id: string, remindIn: number) => {
  setTimeout(() => {
    chrome.notifications.create(id, {
      title: "Unmark",
      message: "Bookmark Reminder",
      type: "basic",
      iconUrl: "/icons/unmark-icon-32x32.png",
    });
  }, remindIn * 1000);
}
