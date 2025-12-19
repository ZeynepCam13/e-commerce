import { ISubSubCategory } from "./ISubSubCategory";

export interface ISubCategory {
  id: number;
  name: string;
  categoryId: number;
  subSubCategories: ISubSubCategory[];
}
