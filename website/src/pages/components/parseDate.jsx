const parseDateToISO = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase().includes("inget inlämningsdatum")) {
    return null;
  }

  // Regex matches: [day] [month] [optional year] av/by [HH:MM or HH.MM]
  const match = dateStr.match(
    /(\d{1,2}) (\w+)(?: (\d{4}))? (?:av|by) (\d{1,2})[:.]?(\d{2})/i
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
