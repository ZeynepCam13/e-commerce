import { ISubCategory } from "./ISubCategory";

export interface ICategory {
  id: number;
  name: string;
  description?: string;
  subCategories:ISubCategory[];
}
