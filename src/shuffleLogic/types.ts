export interface ShuffleMethod {
  id: string;
  name: string;
  description: string;
  generate: (phoneNumber: string) => string[];
}