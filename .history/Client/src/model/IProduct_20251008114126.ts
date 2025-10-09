import { ICategory } from "./ICategory";

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
    category?: ICategory
}