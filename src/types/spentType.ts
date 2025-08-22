export interface SpentDbData {
  credit: number;
  electricity: number;
  gas: number;
  water?: number;
  spending: number;
}

export type SpentDbArray = { [key: string]: SpentDbData };

export interface SpentApiData {
  month: string;
  credit: number;
  electricity: number;
  gas: number;
  spending: number;
  water: number;
}
