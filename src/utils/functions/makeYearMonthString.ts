/**
 * 月日の文字列を作成するメソッド.
 * @param date - 今日の日付
 * @returns 202301の形の文字列
 */
export const makeYearMonthString = (date: Date): string => {
  const CUTOFF_DATE = 20;
  const isAfterCutoff = date.getDate() >= CUTOFF_DATE;

  let year = date.getFullYear();
  let month = date.getMonth(); // 0-based (0=January, 11=December)

  if (isAfterCutoff) {
    // 20日以降は当月を使用
    month += 1;
  } else if (month === 0) {
    // 1月の場合は前年の12月
    year -= 1;
    month = 12;
  }

  const monthString = month.toString().padStart(2, '0');

  return `${year}${monthString}`;
};
