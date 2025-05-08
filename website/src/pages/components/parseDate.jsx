const parseDateToISO = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase().includes("inget inlämningsdatum")) {
    return null; // Handle missing or invalid dates
  }

  // Match the date and time in the string
  const match = dateStr.match(/(\d{1,2}) (\w+) (\d{4})? (?:av|by) (\d{1,2}[:.]\d{2})/i);
  if (!match) return null;

  const [ , day, monthStr, year, time ] = match;

  // Map Swedish and English month names to their numeric values
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11
  };

  const month = monthMap[monthStr.slice(0, 3).toLowerCase()];
  if (month === undefined) return null;

  // Use the current year if no year is provided
  const now = new Date();
  const resolvedYear = year ? parseInt(year) : now.getFullYear();

  // Handle time format with ":" or "."
  const [hours, minutes] = time.replace(".", ":").split(":").map(Number);

  // Create the date object
  const date = new Date(resolvedYear, month, parseInt(day), hours, minutes);
  return date.toISOString();
};

export default parseDateToISO;