chrome.runtime.onInstalled.addListener(() => {
  // const bookmarks = JSON.parse(localStorage.getItem("unmark-BOOKMARKS_LIST"));
  // if (bookmarks) {
  //   bookmarks.forEach((bookmark) => {
  //     if (bookmark.remindIn) {
  //       chrome.alarms.create(`${bookmark.url}*_*${bookmark.title}`, {
  //         when: bookmark.remindIn.toDate().getTime(),
  //       });
  //     }
  //   });
  // }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  const [, title] = alarm.name.split("*_*");
  chrome.notifications.create(alarm.name, {
    title: "Unmark - Reminder",
    message: `Time to visit ( ${title} ) bookmark`,
    type: "basic",
    iconUrl: "/icons/unmark-icon-128x128.png",
    buttons: [
      {
        title: "Open Bookmark",
      },
      { title: "Snooze 5 minutes" },
    ],
  });
});

chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    const [url, title] = notificationId.split("*_*");
    if (buttonIndex === 0) {
      chrome.tabs.create({ url });
    } else {
      chrome.alarms.create(`${url}*_*${title}`, {
        when: Date.now() + 5 * 1000 * 60,
      });
    }
  }
);

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log("onCreated", id, bookmark);
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log("onRemoved", id, removeInfo);
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log("onChanged", id, changeInfo);
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error(err));
