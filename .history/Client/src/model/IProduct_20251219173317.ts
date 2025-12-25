import { ICategory } from "./ICategory";
import { IProductColor} from "./IProductColorDto";
import { ISubCategory } from "./ISubCategory";
import { ISubSubCategory } from "./ISubSubCategory";

export interface IProductImage {
  id: number;
  imageUrl: string;
  productId: number;
}
export interface IProductSize {
  id: number;
  productId: number;
  size: string;
  stock: number;
}

export interface IProduct
{
    id: number,
    name: string,
    description?: string,
    price: number,
    isActive: boolean,
    imageUrl?: string,
    stock?: number,
    categoryId?: number,
    category?: ICategory,
    subCategory?:ISubCategory,
    subSubCategory?:ISubSubCategory,
    originalPrice?: number,
    marka?:string,
    discount?:number,
    images?: IProductImage[];
    productSizes?: IProductSize[];
    productColors?:IProductColor[];
}