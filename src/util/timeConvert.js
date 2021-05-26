import moment from "moment";

export function formatDateWithTime(seconds) {
  if (seconds) {
    return moment(seconds).format("H:mm DD-MM-YYYY");
  }
}

export function formatTime(seconds) {
  if (seconds) {
    return moment(seconds).format("H:mm:ss");
  }
}

export function formatDate(seconds) {
  if (seconds) {
    return moment(seconds).format("DD-MM-YYYY");
  }
}
