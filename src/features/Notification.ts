export const setAlarm = async (title: string, url: string, remindIn: number) => {
  chrome.alarms.create(`${url}*_*${title}`, {
    when: Date.now() + remindIn * 1000,
  });
}
