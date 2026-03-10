const monthList = [
  { month: 'January', value: 1 },
  { month: 'February', value: 2 },
  { month: 'March', value: 3 },
  { month: 'April', value: 4 },
  { month: 'May', value: 5 },
  { month: 'June', value: 6 },
  { month: 'July', value: 7 },
  { month: 'August', value: 8 },
  { month: 'September', value: 9 },
  { month: 'October', value: 10 },
  { month: 'November', value: 11 },
  { month: 'December', value: 12 },
];
export const MonthFinder = (val: any) => {
  const mName = monthList.find((data: any) => data.value === val);
  return mName?.month;
};
