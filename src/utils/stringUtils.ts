/**
 * Converts day of week into human-readable format
 * @param {number} day number of days elapsed since start of week
 * @returns {string} `""` if `day` is out of bounds, otherwise day of week in
 * human-readable format
 */
export function formatDayOfWeek(day: number): string {
  if (day < 0 || day >= 7) {
    return "";
  }

  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

/**
 * Converts hours into human-readable format
 * @param {number} hour number of hours elapsed since start of day
 * @returns {string} `""` if `day` is out of bounds, otherwise hour of day in
 * human-readable format
 */
export function formatHourOfDay(hour: number): string {
  if (hour < 0 || hour > 24) {
    return "";
  }
  if (hour === 0 || hour === 24) {
    return "12 am";
  }

  return hour > 12 ? `${hour - 12} pm` : `${hour} am`;
}

/**
 * Converts a date object into human-readable format for tooltips
 * @param {number} date Date object
 * @returns {string} date in human-readable format
 */
export function formatTooltipDateLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric"
  });
}

/**
 * Converts day of week into human-readable format for tooltips
 * @param {number} day number of days elapsed since start of week
 * @returns {string} `""` if `day` is out of bounds, otherwise day of week in
 * human-readable format
 */
export function formatTooltipDayOfWeekLabel(day: number): string {
  return formatDayOfWeek(day);
}

/**
 * Converts a duration into human-readable format for tooltips
 * @param {number} duration duration in milliseconds
 * @returns {string} duration in human-readable format
 */
export function formatTooltipDurationLabel(duration: number): string {
  const durationInMins = Math.round(duration / 1000 / 60);
  const minutes = Math.floor(durationInMins) % 60;
  const hours = Math.floor(durationInMins / 60);

  let result = "";
  if (hours > 0) {
    result += `${hours} ${hours > 1 ? "hours" : "hour"}`;
  }
  if (minutes > 0) {
    result += ` ${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  }
  if (result !== "") {
    return result.trim();
  }

  const durationInSecs = Math.floor(duration / 1000);
  return durationInSecs > 0
    ? `${durationInSecs} ${durationInSecs > 1 ? "seconds" : "second"}`
    : "No activity";
}

/**
 * Converts hour-of-week into human-readable format for tooltips
 * @param {number} day number of days elapsed since start of week
 * @param {number} hour number of hours elapsed since start of day
 * @returns {string} hour-of-week value in human-readable format
 */
export function formatTooltipHourOfWeekLabel(
  dayOfWeek: number,
  hourOfDay: number
): string {
  return `${formatDayOfWeek(dayOfWeek)}, ${formatHourOfDay(hourOfDay)}`;
}
