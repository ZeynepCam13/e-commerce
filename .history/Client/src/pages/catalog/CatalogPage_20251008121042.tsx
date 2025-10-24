import { useEffect, useState } from "react";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";

export default function CatalogPage(){
   
        const [products, setProducts] = useState<IProduct[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        
        useEffect(() => {
            requests.Catalog.list()
                .then(data => setProducts(data))
                .finally(() => setLoading(false));
        }, []);

        return (
            <>
                {loading ? <div>Loading...</div> : <ProductList products={products} />}
            </>
        );
}