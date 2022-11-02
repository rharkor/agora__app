const ical2json = require("ical2json");

const calendarUtils = {
  getData: async (username) => {
    const response = await fetch("http://localhost:3000/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
    const data = await response.text();

    // From ical to JSON
    const output = ical2json.convert(data);
    const allEvents = output.VCALENDAR[0].VEVENT;

    const getZoneId = (el) => {
      for (let key in el) {
        if (key.includes("TZID=")) {
          return key.split("TZID=")[1];
        }
      }
    };

    const teacherReg = new RegExp(/[A-Z]\.[A-Z][a-z]+/);
    const classroomReg = new RegExp(/(?:pas|Pcm|Msi).*/);
    const otherReg = new RegExp(/[a-zA-Z]+/);

    if (allEvents) {
      return allEvents.map((el) => {
        const zone = getZoneId(el);
        const start = el[`DTSTART;TZID=${zone}`];
        const end = el[`DTEND;TZID=${zone}`];
        const stamp = el.DTSTAMP;
        let title = el.SUMMARY;
        const description = el.DESCRIPTION;

        // Format title
        title = title.replace("[edt]", "");
        const titleBuffer = title.split("\\n");
        title = titleBuffer[0];
        const type = title.includes("Td")
          ? "td"
          : title.includes("Cm")
          ? "cm"
          : title.includes("Tp")
          ? "tp"
          : "other";
        let teacher = null;
        let classroom = null;
        let other = null;
        if (titleBuffer[1]) {
          if (titleBuffer[1].match(teacherReg)) {
            teacher = titleBuffer[1];
            // console.log(titleBuffer[1], "is a teacher!");
          } else if (titleBuffer[1].match(classroomReg)) {
            classroom = titleBuffer[1];
            // console.log(titleBuffer[1], "is a classroom!");
          } else if (titleBuffer[1].match(otherReg)) {
            other = titleBuffer[1];
            // console.log(titleBuffer[1], "is other");
          } else {
            // console.log(titleBuffer[1], "is nothing");
          }
        }

        if (titleBuffer[2]) {
          if (titleBuffer[2].match(teacherReg)) {
            teacher = titleBuffer[2];
            // console.log(titleBuffer[2], "is a teacher!");
          } else if (titleBuffer[2].match(classroomReg)) {
            classroom = titleBuffer[2];
            // console.log(titleBuffer[2], "is a classroom!");
          } else if (titleBuffer[2].match(otherReg)) {
            other = titleBuffer[2];
            // console.log(titleBuffer[2], "is other");
          } else {
            // console.log(titleBuffer[2], "is nothing");
          }
        }

        return {
          id: el.UID,
          title,
          description,
          stamp: new Date(
            stamp.slice(0, 4),
            parseInt(stamp.slice(4, 6)) - 1,
            stamp.slice(6, 8),
            stamp.slice(9, 11),
            stamp.slice(11, 13),
            stamp.slice(13, 15)
          ),
          startDate: new Date(
            start.slice(0, 4),
            parseInt(start.slice(4, 6)) - 1,
            start.slice(6, 8),
            start.slice(9, 11),
            start.slice(11, 13)
          ),
          endDate: new Date(
            end.slice(0, 4),
            parseInt(end.slice(4, 6)) - 1,
            end.slice(6, 8),
            end.slice(9, 11),
            end.slice(11, 13)
          ),
          zone,
          teacher,
          location: classroom,
          other,
          type,
        };
      });
    }

    throw "error";
  },
};

export default calendarUtils;
