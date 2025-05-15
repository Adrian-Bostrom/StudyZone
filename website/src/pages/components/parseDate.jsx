const parseDateToISO = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase().includes("inget inlämningsdatum")) {
    return null;
  }

  // Handle relative days (e.g., Monday by 23:59)
  const weekdayMatch = dateStr.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday) by (\d{1,2})[:.]?(\d{2})/i);
  if (weekdayMatch) {
    const [, weekdayStr, hourStr, minuteStr] = weekdayMatch;
    const weekdays = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6
    };
    const targetDay = weekdays[weekdayStr.toLowerCase()];
    if (targetDay === undefined) return null;

    const now = new Date();
    const currentDay = now.getDay();
    let diff = targetDay - currentDay;
    if (diff < 0) diff += 7; // Go to next week if already passed

    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + diff);
    dueDate.setHours(parseInt(hourStr), parseInt(minuteStr), 0, 0);
    return dueDate.toISOString();
  }

  // Match absolute format: 4 May by 23:59
  const match = dateStr.match(
    /(\d{1,2}) (\w+)(?: (\d{4}))? (?:av|by|kl|at) (\d{1,2})[:.]?(\d{2})/i
  );
  if (!match) return null;

  const [, dayStr, monthStr, yearStr, hourStr, minuteStr] = match;

  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, may: 4,
    jun: 5, jul: 6, aug: 7, sep: 8,
    okt: 9, oct: 9, nov: 10, dec: 11
  };

  const monthKey = monthStr.slice(0, 3).toLowerCase();
  const month = monthMap[monthKey];
  if (month === undefined) return null;

  const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const date = new Date(year, month, day, hour, minute);
  return date.toISOString();
};

export default parseDateToISO;
