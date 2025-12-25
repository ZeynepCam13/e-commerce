import { ICategory } from "./ICategory";

export interface IProductImage {
  id: number;
  imageUrl: string;
  productId: number;
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
    originalPrice?: number,
    

    discount?:number,
     images?: IProductImage[];
}