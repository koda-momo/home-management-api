// spentController用モックデータ
export const mockSpentList = [
  {
    month: '2024-01',
    credit: 50000,
    electricity: 8000,
    gas: 5000,
    water: 3000,
    spending: 66000,
    other: 2000,
  },
];

export const mockSpentData = {
  month: '2024-01',
  credit: 50000,
  electricity: 8000,
  gas: 5000,
  water: 3000,
  spending: 66000,
  other: 2000,
};

export const mockSpentRequestBody = {
  credit: 50000,
  electricity: 8000,
  gas: 5000,
  water: 3000,
  other: 2000,
};

export const mockSpentPostData = {
  month: '2024-01',
  ...mockSpentRequestBody,
  spending: 68000,
};

// spentService用モックデータ
export const mockSpentServiceData = {
  '2024-01': {
    credit: 50000,
    electricity: 8000,
    gas: 5000,
    spending: 66000,
    other: 3000,
  },
  '2024-02': {
    credit: 45000,
    electricity: 7500,
    gas: 4500,
    water: 3000,
    spending: 60000,
    other: 2500,
  },
};

export const mockSpentMonthData = {
  credit: 50000,
  electricity: 8000,
  gas: 5000,
  water: 3000,
  spending: 66000,
  other: 2000,
};
