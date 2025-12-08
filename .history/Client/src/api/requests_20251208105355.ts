import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Router";
import { store } from "../store/store";


axios.defaults.baseURL = "http://localhost:5198/api/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((request) => {
  const reduxToken = store.getState().account.user?.token;
  const storageToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const token = reduxToken || storageToken;

  if (token && request.headers) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});



axios.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (data.errors) {
          const modelErrors: string[] = [];
          for (const key in data.errors) {
            modelErrors.push(data.errors[key]);
          }
          throw modelErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error("Hatalı kullanıcı adı yada parola");
        break;
      case 403:
        toast.error("Bu işlem için yetkiniz yok (sadece admin girebilir).");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data, status } });
        break;
      default:
        toast.error("Beklenmeyen bir hata oluştu!");
        break;
    }

    return Promise.reject(error.response);
  }
);


const queries = {
  get: (url: string) =>
    axios.get(url).then((response: AxiosResponse) => response.data),
  post: (url: string, body: {}) =>
    axios.post(url, body).then((response: AxiosResponse) => response.data),
  put: (url: string, body: {}) =>
    axios.put(url, body).then((response: AxiosResponse) => response.data),
  delete: (url: string) =>
    axios.delete(url).then((response: AxiosResponse) => response.data),
};


const Errors = {
  get400Error: () => queries.get("/error/bad-request"),
  get401Error: () => queries.get("/error/unauthorized"),
  get404Error: () => queries.get("/error/not-found"),
  get500Error: () => queries.get("/error/server-error"),
  getValidationError: () => queries.get("/error/validation-error"),
};


const Catalog = {
  list: () => queries.get("products"),
  details: (id: number) => queries.get(`products/${id}`),
  getByCategory: (categoryId: number) =>
    queries.get(`products/byCategory/${categoryId}`),
  add: (product: any) => queries.post("products/add", product),
  update: (id: number, product: any) => queries.put(`products/${id}`, product),
  delete: (id: number) => queries.delete(`products/${id}`),
  discounted: () => queries.get("products/discounted"),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios
      .post("products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res: AxiosResponse) => res.data);
  },
 getCategories: () => queries.get("category"),
  

};


const Cart = {
  get: () => queries.get("cart"),
  addItem: (productId: number, quantity = 1) =>
    queries.post(`cart?productId=${productId}&quantity=${quantity}`,{}),
  deleteItem: (productId: number, quantity = 1) =>
    queries.delete(`cart?productId=${productId}&quantity=${quantity}`),
};


const Account = {
  login: (formData: any) => queries.post("account/login", formData),
  register: (formData: any) => queries.post("account/register", formData),
  getUser: () => queries.get("account/getuser"),
  forgotPassword(email: string) {
    return queries.post("account/forgotpassword", { email });
},

resetPassword(data: any) {
    return queries.post("account/resetpassword", data);
},

};


const Comments= {
  list: (productId: number) => queries.get(`comments/${productId}`),
  add: (body: { productId: number; text: string }) =>
    queries.post("comments", {
      productId: body.productId,
      text: body.text
    })
};


const Order = {
  getOrders: () => queries.get("orders"),
  getOrder: (id: number) => queries.get(`orders/${id}`),
  createOrder: (formData: any) => queries.post("orders", formData),
  listAll:()=>queries.get('orders/all'),
   updateStatus: (id: number, status: number) =>
    queries.put(`/orders/${id}/status`, { status }),
};


const Admin = {
  createProduct: (data: any) => queries.post("products/add", data),
  updateProduct: (data: any) => queries.put(`products/${data.id}`, data),
  deleteProduct: (id: number) => queries.delete(`products/${id}`),
  uploadImage:(file:File)=>{
    const formData=new FormData();
    formData.append("file",file);
    return axios.post("products/upload",formData,{
      headers:{"Content-Type":"multipart/form-data"},
    })
  },
   createProductForm: (formData: FormData) =>
    axios.post("products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateProductForm: (id: number, formData: FormData) =>
    axios.put(`products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  
  updateDiscount: (id: number, discount: number) =>
  axios.put(`products/discount/${id}`, JSON.stringify(discount), {
    headers: { "Content-Type": "application/json" },
  }),

  
};


const Category = {
  list: () => queries.get("category"),
  add: (formData: any) => queries.post("category", formData),
  delete: (id: number) => queries.delete(`category/${id}`),
};


const Favorites={
  list:()=>queries.get('favorites'),
  add:(productId:number)=>queries.post(`favorites/${productId}`,{}),
  remove:(productId:number) => queries.delete(`favorites/${productId}`)
}


const requests = {
  Catalog,
  Errors,
  Cart,
  Account,
  Order,
  Category,
  Admin,
  Favorites,
  Comments
};

export default requests;
