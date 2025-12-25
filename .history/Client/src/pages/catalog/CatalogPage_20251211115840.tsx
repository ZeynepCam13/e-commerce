import { useEffect, useState } from "react";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import ProductList from "../../features/catalog/ProductList";
import { useSearchParams } from "react-router";

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();

  // Parametreler string döner, bu yüzden number’a çevirmemiz gerek
  const categoryId = searchParams.get("category");
  const subCategoryId = searchParams.get("subcategory");
  const subSubCategoryId = searchParams.get("subsub");

  useEffect(() => {
    setLoading(true);

    // ALT–ALT KATEGORİ (En yüksek öncelik)
    if (subSubCategoryId) {
      requests.Catalog.bySubSub(Number(subSubCategoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

    // ALT KATEGORİ (İkinci öncelik)
    if (subCategoryId) {
      requests.Catalog.bySubCategory(Number(subCategoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

    // ANA KATEGORİ (Üçüncü öncelik)
    if (categoryId) {
      requests.Catalog.byCategory(Number(categoryId))
        .then((data) => setProducts(data))
        .finally(() => setLoading(false));
      return;
    }

    // Parametre yok → TÜM ÜRÜNLER
    requests.Catalog.list()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [categoryId, subCategoryId, subSubCategoryId]);


  return (
    <>
      {loading ? <div>Loading...</div> : <ProductList products={products} />}
    </>
  );
}
