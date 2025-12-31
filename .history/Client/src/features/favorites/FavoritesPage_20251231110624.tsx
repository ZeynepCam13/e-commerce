import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getFavorites } from "./FavoritesSlice";
import ProductList from "../catalog/ProductList";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector(state => state.favorites);

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  return (
    <div style={{ padding: "2rem",textAlign:"center" }}>
      <h1>Favorilerim</h1>
      <ProductList products={favorites} />
    </div>
  );
}
