import api from "./api";

const ical2json = require("ical2json");

const calendarUtils = {
  getData: async (username) => {
    const response = await api.defaultFetch("calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
    const data = await response.text();

    if (data) {
      if (data === '{"message":"Error. Bad token"}') throw "Error. Bad token";
      if (data === '{"status":"error","error":"You can\'t access this module"}')
        throw "You can't access this module";
    }

    // From ical to JSON
    const output = ical2json.convert(data);
    const allEvents = output.VCALENDAR[0].VEVENT;

    if (allEvents) {
      return allEvents.map((el) => {
        const start = el[`DTSTART`] ?? "";
        const end = el[`DTEND`] ?? "";
        const stamp = el.DTSTAMP ?? "";
        let title = el["SUMMARY;LANGUAGE=fr"] ?? "";
        const description = el["DESCRIPTION;LANGUAGE=fr"] ?? "";
        const location = el["LOCATION;LANGUAGE=fr"] ?? "";

        // Format title
        const [titleF, teacher, ...otherI] = title.split(" - ");
        const other = otherI.join(" - ");

        return {
          id: el.UID,
          title: titleF,
          description,
          stamp:
            stamp &&
            new Date(
              Date.UTC(
                stamp.slice(0, 4),
                parseInt(stamp.slice(4, 6)) - 1,
                stamp.slice(6, 8),
                stamp.slice(9, 11),
                stamp.slice(11, 13),
                stamp.slice(13, 15)
              )
            ),
          startDate:
            start &&
            new Date(
              Date.UTC(
                start.slice(0, 4),
                parseInt(start.slice(4, 6)) - 1,
                start.slice(6, 8),
                start.slice(9, 11),
                start.slice(11, 13)
              )
            ),
          endDate:
            end &&
            new Date(
              Date.UTC(
                end.slice(0, 4),
                parseInt(end.slice(4, 6)) - 1,
                end.slice(6, 8),
                end.slice(9, 11),
                end.slice(11, 13)
              )
            ),
          teacher,
          location,
          other,
        };
      });
    }

    throw "error";
  },
};

export default calendarUtils;
