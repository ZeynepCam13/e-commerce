import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../features/HomePage";
import AboutPage from "../features/AboutPage";
import CatalogPage from "../features/catalog/CatalogPage";
import ProductDetailsPage from "../features/catalog/ProductDetails";
import ErrorPage from "../features/ErrorPage";
import ServerError from "../errors/ServerError";
import ShoppingCartPage from "../features/cart/ShoppingCartPage";
import LoginPage from "../features/account/loginPage";
import RegisterPage from "../features/account/RegisterPage";
import ChechkoutPage from "../features/checkout/CheckoutPage";
import OrderList from "../features/orders/OrderList";
import AuthGuard from "./AuthGuard";
import AdminDashboard from "../features/admin/AdminDashboard";
import AdminStatistics from "../features/admin/AdminStatistics";
import AdminOrdersPage from "../features/admin/AdminOrdersPage";
import AdminGuard from "./AdminGuard";
import FavoritesPage from "../features/favorites/FavoritesPage";
import SettingsPage from "../features/account/SettingsPage";
import SalePage from "../features/SalePage";
import VerifyEmail from "../features/account/VerifyEmail";
import VerifySmsPage from "../features/account/VerifySmsPage";
import ForgotPasswordPage from "../features/account/ForgotPasswordPage";
import ResetPasswordPage from "../features/account/ResetPasswordPage";



export const router=createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children:[
            { element:<AuthGuard/>,children: [
                {path:"checkout",element:<ChechkoutPage/>},
                {path: "orders", element:<OrderList/>},
                {path:"admin",element:<AdminDashboard/>},
                {path:"favorites", element:<FavoritesPage/>}
                
            ]
            
            },
            {
        element: <AdminGuard />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
          { path: "admin/orders", element: <AdminOrdersPage /> },
          {path:"admin/istatik",element:<AdminStatistics/>}
          
        ]},   
            {path:"",element:<HomePage/>},
            {path:"about",element:<AboutPage/>},
            {path:"contact",element:<SalePage/>},
            {path:"catalog",element:<CatalogPage/>},
            {path:"error",element:<ErrorPage/>},
            {path:"server-error",element:<ServerError/>},
            {path:"catalog/:id",element:<ProductDetailsPage/>},
            {path:"login",element:<LoginPage/>},
            {path:"register",element:<RegisterPage/>},
            {path:"checkout",element:<ChechkoutPage/>},
            {path:"cart",element:<ShoppingCartPage/>},
            {path:"settings",element: <SettingsPage/>} ,
            {path:"verify-email", element:<VerifyEmail/>},
            {path:"verify-sms-page",element:<VerifySmsPage/>},
            {path:"forgotpassword", element:<ForgotPasswordPage/>},
            {path:"resetpassword",element:<ResetPasswordPage/>}

            

        ]

    }
])