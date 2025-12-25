import { useState } from "react";
import axios from "axios";

export default function VerifySmsPage() {
  const phone = new URLSearchParams(window.location.search).get("phone");
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:5198/api/account/verify-sms-code", {
        phone,
        code,
      });

      if (res.status === 200) {
        alert("Telefon doğrulandı! Artık giriş yapabilirsiniz.");
        window.location.href = "/login";
      }
    } catch (err) {
      alert("Kod yanlış veya süresi doldu.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h2>SMS Doğrulama</h2>
      <p>{phone} numarasına gönderdiğimiz SMS kodunu girin.</p>

      <input
        type="text"
        placeholder="Doğrulama Kodu"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "10px 0" }}
      />

      <button onClick={handleVerify} style={{ width: "100%", padding: 10 }}>
        Doğrula
      </button>
    </div>
  );
}
