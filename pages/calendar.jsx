import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  AppointmentTooltip,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FaceIcon from "@mui/icons-material/Face";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import calendarUtils from "../utils/calendar";
import { useAuth } from "../contexts/AuthContext";

const resources = [
  {
    fieldName: "type",
    title: "Type de cours",
    instances: [
      { id: "td", text: "TD" },
      { id: "tp", text: "TP" },
      { id: "cm", text: "CM" },
      { id: "other", text: "Autre" },
    ],
  },
];

const tooltipContent = ({ children, appointmentData, ...restProps }) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    {appointmentData.location ? (
      <Grid
        container
        alignItems="center"
        sx={{
          paddingBottom: "12px",
        }}
      >
        <Grid
          xs={2}
          sx={{
            height: "20px",
            textAlign: "center",
          }}
          item
        >
          <LocationOnIcon />
        </Grid>
        <Grid xs={10} item>
          {appointmentData.location}
        </Grid>
      </Grid>
    ) : (
      <></>
    )}
    {appointmentData.teacher ? (
      <Grid
        container
        alignItems="center"
        sx={{
          paddingBottom: "12px",
        }}
      >
        <Grid
          xs={2}
          sx={{
            height: "20px",
            textAlign: "center",
          }}
          item
        >
          <FaceIcon />
        </Grid>
        <Grid xs={10} item>
          {appointmentData.teacher}
        </Grid>
      </Grid>
    ) : (
      <></>
    )}
    {appointmentData.other ? (
      <Grid
        container
        alignItems="center"
        sx={{
          paddingBottom: "12px",
        }}
      >
        <Grid
          xs={2}
          sx={{
            height: "20px",
            textAlign: "center",
          }}
          item
        >
          <MoreHorizIcon />
        </Grid>
        <Grid xs={10} item>
          {appointmentData.other}
        </Grid>
      </Grid>
    ) : (
      <></>
    )}
  </AppointmentTooltip.Content>
);

const Calendar = () => {
  const [calendarData, setCalendarData] = useState();
  const currentDate = new Date();
  const [alreadyFetch, setAlreadyFetch] = useState(false);
  const [mainResourceName, setMainResourceName] = useState("type");

  const router = useRouter();
  const { token, initialized, univUsername } = useAuth();

  useEffect(() => {
    if (initialized && !token) {
      router.push("/signin");
    }
  }, [token, initialized]);

  const getCalendarData = async () => {
    try {
      setCalendarData(await calendarUtils.getData(univUsername));
      setAlreadyFetch(true);
    } catch (e) {
      console.error(e);
      toast.error("Une erreur est survenue..");
    }
  };

  useEffect(() => {
    if (univUsername && !alreadyFetch) {
      getCalendarData();
    }
  }, [univUsername]);

  return (
    <main>
      <Paper>
        <Scheduler data={calendarData} locale={"fr-FR"}>
          <ViewState
            defaultCurrentDate={currentDate}
            defaultCurrentViewName="Week"
          />
          <DayView startDayHour={8} endDayHour={20} displayName="jour" />
          <WeekView startDayHour={8} endDayHour={20} displayName="semaine" />

          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip contentComponent={tooltipContent} />
          <Resources
            data={resources}
            mainResourceName={mainResourceName}
            palette={["#2196f3", "#ff5722", "#26a69a", "#757575"]}
          />
        </Scheduler>
      </Paper>
    </main>
  );
};

export default Calendar;
