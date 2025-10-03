import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../features/HomePage";
import AboutPage from "../features/AboutPage";
import ContactPage from "../features/ContactPage";
import CatalogPage from "../features/catalog/CatalogPage";
import ProductDetailsPage from "../features/catalog/ProductDetails";
import ErrorPage from "../features/ErrorPage";
import ServerError from "../errors/ServerError";
import ShoppingCartPage from "../features/cart/ShoppingCartPage";
import LoginPage from "../features/account/loginPage";
import RegisterPage from "../features/account/RegisterPage";

export const router=createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children:[
            {path:"",element:<HomePage/>},
            {path:"about",element:<AboutPage/>},
            {path:"contact",element:<ContactPage/>},
            {path:"catalog",element:<CatalogPage/>},
            {path:"error",element:<ErrorPage/>},
            {path:"server-error",element:<ServerError/>},
            {path:"catalog/:id",element:<ProductDetailsPage/>},
            {path:"login",element:<LoginPage/>},
            {path:"register",element:<RegisterPage/>},
            {path:"cart",element:<ShoppingCartPage/>}
        ]

    }
])