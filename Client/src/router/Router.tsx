import { createBrowserRouter } from "react-router";
import App from "../components/App";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import CatalogPage from "../pages/catalog/CatalogPage";
import ProductDetailsPage from "../pages/catalog/ProductDetails";
import ErrorPage from "../pages/ErrorPage";
import ServerError from "../errors/ServerError";
import ShoppingCartPage from "../pages/cart/ShoppingCartPage";

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
            {path:"cart",element:<ShoppingCartPage/>}
        ]

    }
])