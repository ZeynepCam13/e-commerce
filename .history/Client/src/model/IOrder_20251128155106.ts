export interface Order {
    id: number
    orderDate: Date
    firstName: string
    lastName: string
    phone: string
    city: string
    addresLine: string
    customerId: string
    orderStatus: "Pending"
    orderItems: OrderItem[]
    subTotal: number
    deliveryFree: number
    userName?: string;
    email?: string;
  }
  
  export interface OrderItem {
    id: number
    productId: number
    productName: string
    productImage: string
    price: number
    quantity: number
  }
  