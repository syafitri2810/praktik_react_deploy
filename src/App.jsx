// src/App.jsx  —  Formulir Login "Jendela Pagi"
// Geser slider -> tirai terbuka -> langit berubah jadi pagi
// -> formulir login aktif.

import { useState } from "react";
import "./App.css"; // styling ada di file App.css

// Posisi bintang di langit malam: [kiri %, atas %]
const BINTANG = [
  [12, 10],
  [30, 22],
  [55, 8],
  [70, 26],
  [85, 14],
  [22, 38],
  [62, 40],
  [90, 34],
  [42, 16],
  [8, 30],
];

// ------------------------------------------------------------
// Komponen 1: Jendela (gambar jendela + tirai + langit)
// Props:
//   t = nilai 0 sampai 1 (0 = malam & tirai tutup, 1 = pagi & tirai buka)
// ------------------------------------------------------------
function Jendela({ t }) {
  return (
    <div className="left">
      {/* Batang penggantung tirai */}
      <div className="rod" />

      <div className="frame">
        {/* Langit malam (selalu di belakang) */}
        <div className="skyn">
          {BINTANG.map((b, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: b[0] + "%",
                top: b[1] + "%",
                animationDelay: i * 0.3 + "s",
              }}
            />
          ))}
        </div>

        {/* Langit pagi: makin terbuka tirai, makin jelas (opacity = t) */}
        <div className="sky" style={{ opacity: t }}>
          <div className="cloud" style={{ top: "26%" }} />
          <div
            className="cloud"
            style={{
              top: "42%",
              animationDelay: "-11s",
              transform: "scale(.7)",
            }}
          />
        </div>

        {/* Matahari naik dari bawah: translateY mengecil saat t membesar */}
        <div
          className="sun"
          style={{
            transform: `translateY(${(1 - t) * 260}px)`,
            opacity: Math.min(1, t * 1.4),
          }}
        />

        {/* Bukit: warnanya hijau saat pagi, gelap saat malam */}
        <svg className="hills" viewBox="0 0 300 100" preserveAspectRatio="none">
          <path
            d="M0 40 Q70 0 140 35 T300 25 V100 H0Z"
            fill={t > 0.5 ? "#7bc47f" : "#16213f"}
            style={{ transition: "fill .5s" }}
          />
          <path
            d="M0 70 Q90 35 170 62 T300 55 V100 H0Z"
            fill={t > 0.5 ? "#4ea65a" : "#101a34"}
            style={{ transition: "fill .5s" }}
          />
        </svg>

        {/* Kusen jendela (salib) */}
        <div className="bar-h" />
        <div className="bar-v" />

        {/* Tirai kiri & kanan: mengecil sesuai nilai t */}
        <div
          className="curt l"
          style={{ transform: `scaleX(${1 - t * 0.85})` }}
        />
        <div
          className="curt r"
          style={{ transform: `scaleX(${1 - t * 0.85})` }}
        />
      </div>
    </div>
  );
}

// Komponen 2: Formulir login
// Props:
//   aktif = true kalau tirai sudah cukup terbuka-
function Formulir({ aktif }) {
  const [user, setUser] = useState(""); // isi kolom nama pengguna
  const [pass, setPass] = useState(""); // isi kolom kata sandi
  const [berhasil, setBerhasil] = useState(false); // sudah klik "Masuk"?

  // Dijalankan saat tombol "Masuk" ditekan
  const kirim = (e) => {
    e.preventDefault(); // cegah halaman reload
    if (user && pass) setBerhasil(true);
    // TODO: di sini nanti panggil API login kalau sudah ada backend
  };

  return (
    <div className={"card" + (aktif ? " active" : "")}>
      {berhasil ? (
        // Tampilan setelah berhasil masuk
        <div className="ok">
          <div className="e">🌤️</div>
          <h1>Selamat pagi, {user}!</h1>
          <p className="sub">Semoga harimu secerah jendela ini.</p>
          <button
            onClick={() => {
              setBerhasil(false);
              setPass("");
            }}
          >
            Keluar
          </button>
        </div>
      ) : (
        // Tampilan formulir
        <form onSubmit={kirim}>
          <h1>{aktif ? "Selamat Pagi" : "Masih Malam"}</h1>
          <p className="sub">
            {aktif
              ? "Masuk untuk memulai harimu"
              : "Buka tirai dulu untuk menyambut pagi"}
          </p>

          <label htmlFor="user">NAMA PENGGUNA</label>
          <input
            id="user"
            className="t"
            disabled={!aktif} // terkunci selama tirai belum terbuka
            value={user}
            placeholder="contoh: din"
            autoComplete="username"
            onChange={(e) => setUser(e.target.value)}
          />

          <label htmlFor="pass">KATA SANDI</label>
          <input
            id="pass"
            className="t"
            type="password"
            disabled={!aktif}
            value={pass}
            placeholder="••••••••"
            autoComplete="current-password"
            onChange={(e) => setPass(e.target.value)}
          />

          {/* Tombol mati kalau form terkunci atau kolom masih kosong */}
          <button
            className="go"
            type="submit"
            disabled={!aktif || !user || !pass}
          >
            Masuk
          </button>
        </form>
      )}
    </div>
  );
}

// Komponen utama: menyatukan jendela, slider, dan formulir
export default function App() {
  const [nilai, setNilai] = useState(0); // posisi slider: 0 sampai 100
  const t = nilai / 100; // diubah ke 0 sampai 1
  const aktif = nilai >= 70; // formulir aktif kalau tirai terbuka >= 70%

  return (
    <div className={"scene" + (t > 0.5 ? " day" : "")}>
      {/* Latar halaman: gelap (malam) dan terang (pagi), saling tumpuk */}
      <div className="bgd" />
      <div className="bgl" style={{ opacity: t }} />

      {/* Kolom kiri: jendela + slider */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 300,
          maxWidth: "100%",
        }}
      >
        <Jendela t={t} />
        <div className="ctl">
          <input
            type="range"
            min={0}
            max={100}
            value={nilai}
            aria-label="Buka tirai"
            onChange={(e) => setNilai(Number(e.target.value))}
          />
          <div>{aktif ? "Pagi sudah tiba" : "Geser untuk membuka tirai"}</div>
        </div>
      </div>

      {/* Kolom kanan: formulir login */}
      <Formulir aktif={aktif} />
    </div>
  );
}
