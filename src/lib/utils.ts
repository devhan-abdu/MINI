export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function getPlannedDates(
  weekStartDate: string,
  selectedDays: number[],
  plannedPages: number,
  startPage: number
) {
  const result: { date: string; day_of_week: string; planned_start_page: number; planned_end_page: number; planned_pages: number; }[] = [];
  const start = new Date(weekStartDate);
  let currentPage = startPage;

  selectedDays.forEach((offset) => {
    const d = new Date(start);
    d.setDate(start.getDate() + offset);

    result.push({
      date: d.toISOString().slice(0, 10),
      day_of_week: dayNames[d.getDay()],
      planned_start_page: currentPage,
      planned_end_page: currentPage + plannedPages - 1,
      planned_pages: plannedPages,
    });

    currentPage += plannedPages;
  });

  return result;
}
