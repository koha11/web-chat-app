export const getDisplaySendMsgTime = (sendTime: Date) => {
  let timeString = "";

  // Hiệu giữa thời gian hiện tại với thời gian của tin nhắn
  const diffTime = new Date().getTime() - sendTime.getTime();

  // Nếu tin nhắn được nhắn trong ngày
  if (sendTime.getDay() == new Date().getDay())
    timeString = sendTime.toLocaleTimeString("vi-VN").slice(0, 5);
  // Nếu tin nhắn được nhắn trong vòng 7 ngày đổ lại
  else if (diffTime / (1000 * 60 * 60 * 24) <= 7) {
    timeString = sendTime.toLocaleTimeString("vi-VN", {
      weekday: "short",
    });

    timeString = timeString.slice(0, 5).concat(timeString.slice(8, 13));

    // Mặc định (tin nhắn xa hơn 7 ngày)
  } else {
    timeString = sendTime.toLocaleTimeString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    timeString = timeString.slice(0, 5).concat(timeString.slice(8));
  }

  return timeString;
};

export const getDisplayTimeDiff = (sendTime: Date) => {
  const diffTime = new Date().getTime() - sendTime.getTime();

  const minutes = Math.round(diffTime / (1000 * 60));

  if (minutes < 60) return minutes + " minutes";

  const hours = Math.round(diffTime / (1000 * 60 * 60));

  if (hours < 24) return hours + " hours";

  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (days < 7) return days + " days";

  const weeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));

  return weeks + " Weeks";
};

export const getTimeDiff = (
  firstTime: Date,
  secondTime: Date,
  option: TimeTypeOption
) => {
  const diffTime = firstTime.getTime() - secondTime.getTime();

  switch (option) {
    case TimeTypeOption.SECONDS:
      return Math.round(diffTime / 1000);
    case TimeTypeOption.MINUTES:
      return Math.round(diffTime / (1000 * 60));
    case TimeTypeOption.HOURS:
      return Math.round(diffTime / (1000 * 60 * 60));
    case TimeTypeOption.DAYS:
      return Math.round(diffTime / (1000 * 60 * 60 * 24));
    default:
      return Math.round(diffTime / 1000);
  }
};

export enum TimeTypeOption {
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}
