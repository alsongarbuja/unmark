chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error(err));

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
