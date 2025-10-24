export interface CartItem
{
    productId: number,
    name: string,
    price: number,
    imageUrl :string,
    quantity: number,
  originalPrice?: number; 
  discount?: number;      

}

export interface Cart 
{
    cartId: number;
    customerId: string;
    cartItems: CartItem[];
}