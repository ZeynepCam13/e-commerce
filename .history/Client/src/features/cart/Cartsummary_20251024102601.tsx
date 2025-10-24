import { TableCell, TableRow } from "@mui/material";
import { currenyTRY } from "../../utils/formatCurrency";
import { useAppSelector } from "../../store/store";

export default function CartSummary() {
  const { cart } = useAppSelector((state) => state.cart);


  const originalSubTotal =
    cart?.cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * Number((item.originalPrice ?? item.price)) ,
      0
    ) ?? 0;

 
  const discountedSubTotal =
    cart?.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;

 
  const discountAmount = originalSubTotal - discountedSubTotal;


  const tax = discountedSubTotal * 0.2;
  const total = discountedSubTotal + tax;

  return (
    <>
      {discountAmount > 0 && (
        <TableRow>
          <TableCell align="right" colSpan={5} sx={{ color: "green" }}>
            Uygulanan İndirim
          </TableCell>
          <TableCell align="right" sx={{ color: "green" }}>
            -{currenyTRY.format(discountAmount)}
          </TableCell>
        </TableRow>
      )}

      <TableRow>
        <TableCell align="right" colSpan={5}>
          Ara Toplam
        </TableCell>
        <TableCell align="right">
          {currenyTRY.format(discountedSubTotal)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell align="right" colSpan={5}>
          Vergi (%20)
        </TableCell>
        <TableCell align="right">{currenyTRY.format(tax)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          align="right"
          colSpan={5}
          sx={{ fontWeight: "bold", fontSize: "1rem" }}
        >
          Genel Toplam
        </TableCell>
        <TableCell
          align="right"
          sx={{ fontWeight: "bold", fontSize: "1rem" }}
        >
          {currenyTRY.format(total)}
        </TableCell>
      </TableRow>
    </>
  );
}
