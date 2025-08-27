export interface SpentDbData {
  credit: number;
  spending: number;
  other: number;
}

export type SpentDbArray = { [key: string]: SpentDbData };

export interface SpentApiData {
  month: string;
  credit: number;
  spending: number;
  other: number;
}
