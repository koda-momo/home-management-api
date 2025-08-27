// spentController用モックデータ
export const mockSpentList = [
  {
    month: '2024-01',
    credit: 50000,
    spending: 52000,
    other: 2000,
  },
];

export const mockSpentData = {
  month: '2024-01',
  credit: 50000,
  spending: 52000,
  other: 2000,
};

export const mockSpentRequestBody = {
  credit: 50000,
  other: 2000,
};

export const mockSpentPostData = {
  month: '2024-01',
  ...mockSpentRequestBody,
  spending: 52000,
};

// spentService用モックデータ
export const mockSpentServiceData = {
  '2024-01': {
    credit: 50000,
    spending: 53000,
    other: 3000,
  },
  '2024-02': {
    credit: 45000,
    spending: 47500,
    other: 2500,
  },
};

export const mockSpentMonthData = {
  credit: 50000,
  spending: 52000,
  other: 2000,
};
