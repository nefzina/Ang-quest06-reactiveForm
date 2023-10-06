export interface SearchFormModel {
  searchBy: {
    title: string;
    identifier: string;
  };
  type: string;
  releaseYear: number;
  sheet: string;
}
