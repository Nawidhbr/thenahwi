// A daily study reminder for the reader's own calendar (components/Reminder.astro): builds an .ics file in the browser
// with one event that repeats every day at the chosen time (floating local time, with an alert), linking back to the
// site. Nothing is sent anywhere and nothing is stored.
(() => {
  for (const box of document.querySelectorAll("[data-reminder]")) {
    const ds = box.dataset;
    box.querySelector("[data-reminder-add]").addEventListener("click", () => {
      const [h, m] = (box.querySelector('input[type="time"]').value || "20:00").split(":");
      const now = new Date();
      const pad = (x) => String(x).padStart(2, "0");
      const day = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
      const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
      // Text values in iCalendar escape backslashes, commas, semicolons and newlines.
      const esc = (s) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//The Nahwi//Study reminder//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:study-${stamp}@thenahwi.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${day}T${pad(h)}${pad(m)}00`,
        "DURATION:PT20M",
        "RRULE:FREQ=DAILY",
        `SUMMARY:${esc(ds.title)}`,
        `DESCRIPTION:${esc(`${ds.body} ${ds.url}`)}`,
        `URL:${ds.url}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${esc(ds.title)}`,
        "TRIGGER:PT0M",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
        "",
      ].join("\r\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      a.download = "the-nahwi-study.ics";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      const done = box.querySelector("[data-reminder-done]");
      if (done) done.hidden = false;
    });
  }
})();
