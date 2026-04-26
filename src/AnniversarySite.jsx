import React, { useEffect, useMemo, useRef, useState } from "react";
import {AnimatePresence } from "framer-motion";
import {
  Heart,
  Music2,
  PauseCircle,
  CalendarDays,
  Camera,
  Sparkles,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/* ---------- Floating Hearts Effect ---------- */
function HeartBurst({ onDone }) {
  useEffect(() => {
    const id = setTimeout(() => onDone?.(), 2200);
    return () => clearTimeout(id);
  }, [onDone]);

  const N = 24;
  const hearts = Array.from({ length: N });
  const colors = ["#7C3AED", "#F472B6", "#EC4899", "#A78BFA", "#F9A8D4"];

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((_, i) => {
        const delay = 0.03 * i;
        const x = (Math.random() * 2 - 1) * 200;
        const y = -140 - Math.random() * 200;
        const rot = (Math.random() * 2 - 1) * 35;
        const color = colors[i % colors.length];
        const size = 16 + Math.random() * 20;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.3, 1.2, 1],
              x,
              y,
              rotate: rot,
            }}
            transition={{ duration: 2, delay, ease: "easeOut" }}
            className="absolute left-1/2 top-[65%]"
            style={{ color }}
          >
            <Heart
              style={{ width: size, height: size }}
              fill="currentColor"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- Floating background petals ---------- */
function FloatingPetals() {
  const petals = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 8,
      size: 12 + Math.random() * 16,
    })), []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-pink-300/40"
          style={{ left: p.left, top: "-30px", fontSize: p.size }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Config ---------- */
const DEFAULT_CONFIG = {
  yourName: "Songpanon",
  partnerName: "Waranya",
  anniversaryDate: "2025-06-19",
  songUrl: "/sound/QLER- จีบ.mp3",
  images: [
    "/img/IMG_0453.jpg",
    "/img/IMG_1987.jpg",
    "/img/IMG_4716.JPG",
    "/img/IMG_5572.JPG",
    "/img/IMG_5579.JPG",
    "/img/IMG_4711.JPG",
  ],
  milestones: [
    { date: "2025-4-10", title: "วันแรกที่เจอกัน", note: "เจอกันครั้งแรกกกก 💓", imageIndex: 0 },
    { date: "2023-7-10", title: "1 เดือน", note: "เธอมาหา และเราไปเที่ยวด้วยกัน ✨", imageIndex: 2 },
    { date: "2025-8-10", title: "2 เดือน", note: "เธอมาหาเราอีกครั้ง และเราไปเที่ยวด้วยกัน 🏖️", imageIndex: 3 },
  ],
  imageCards: [
    { src: "/img/IMG_2368.jpg", caption: "ถ่ายโฟโต้บูธด้วยกัน 🌊" },
    { src: "/img/86B4C785-7414-49D6-B1AF-4F6B718E6062.JPG", caption: "เดินเล่นที่มอ 🌸" },
    { src: "/img/IMG_5574.JPG", caption: "ชอบรูปนี้มากกก 🐶" },
  ],
};

/* ---------- Utils ---------- */
function monthsBetween(fromDate, toDate) {
  const years = toDate.getFullYear() - fromDate.getFullYear();
  const months = toDate.getMonth() - fromDate.getMonth();
  const total = years * 12 + months;
  return total >= 0 ? total : 0;
}
function nextMonthlyAnniversary(from) {
  const now = new Date();
  const base = new Date(from);
  const year = now.getFullYear();
  const month = now.getMonth();
  const dim = new Date(year, month + 1, 0).getDate();
  const day = Math.min(base.getDate(), dim);
  let candidate = new Date(year, month, day, 0, 0, 0);
  if (candidate.getTime() <= now.getTime()) {
    const nm = month + 1;
    const dimNext = new Date(year, nm + 1, 0).getDate();
    const dayNext = Math.min(base.getDate(), dimNext);
    candidate = new Date(year, nm, dayNext, 0, 0, 0);
  }
  return candidate;
}
function useCountdown(targetDate) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/* ---------- Lightbox (improved with nav arrows) ---------- */
function Lightbox({ open, onClose, src, caption, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev?.();
      if (e.key === "ArrowRight" && hasNext) onNext?.();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, hasPrev, hasNext, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {hasPrev && (
            <button
              className="absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next */}
          {hasNext && (
            <button
              className="absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); onNext?.(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <motion.figure
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={caption || "photo"}
              className="w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl"
            />
            {caption && (
              <figcaption className="text-center text-white/80 mt-4 text-sm px-4">
                {caption}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Countdown ---------- */
function Countdown({ startDate }) {
  const target = useMemo(() => nextMonthlyAnniversary(new Date(startDate)), [startDate]);
  const { days, hours, minutes, seconds } = useCountdown(target);
  const nextDateStr = target.toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric",
  });

  const boxes = [
    { label: "วัน", val: days, emoji: "📅" },
    { label: "ชั่วโมง", val: hours, emoji: "⏰" },
    { label: "นาที", val: minutes, emoji: "⏱" },
    { label: "วินาที", val: seconds, emoji: "💫" },
  ];

  return (
    <div className="rounded-3xl border border-pink-200/60 bg-white/70 backdrop-blur-sm shadow-soft p-5 sm:p-6 text-center w-full">
      <div className="flex items-center justify-center gap-2 mb-1">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">นับถอยหลังวันครบรอบ</h3>
      </div>
      <p className="text-sm text-dark/60 mb-5">พบกันอีกครั้ง {nextDateStr} 💕</p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {boxes.map((b, i) => (
          <motion.div
            key={i}
            className="rounded-2xl py-3 sm:py-4 bg-gradient-to-b from-violet-50 to-pink-50 border border-pink-100"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className="text-xl sm:text-3xl font-extrabold tabular-nums text-primary">
              {String(b.val).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] sm:text-xs text-dark/60 font-medium tracking-wide uppercase">
              {b.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Music Player ---------- */
function MusicPlayer({ url }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [setProgress] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => alert("กดอีกครั้งเพื่อเล่นเพลง"));
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const update = () => setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    a.addEventListener("timeupdate", update);
    return () => a.removeEventListener("timeupdate", update);
  }, [setProgress]);

  if (!url) return null;
  return (
    <div className="flex items-center gap-2.5">
      <audio ref={audioRef} src={url} preload="none" loop />
      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
          playing
            ? "bg-primary text-white border-primary shadow-soft"
            : "border-pink-200 text-dark hover:bg-pink-50"
        }`}
      >
        {playing ? <PauseCircle className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
        <span>{playing ? "หยุดเพลง" : "เปิดเพลง"}</span>
      </button>
      {playing && (
        <motion.div
          className="flex items-end gap-0.5 h-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 0.2, 0.1].map((d, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-primary"
              animate={{ height: ["8px", "16px", "6px", "14px"] }}
              transition={{ duration: 0.6, delay: d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Gallery with nav ---------- */
function Gallery({ images = [] }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <motion.button
            key={i}
            className="aspect-square rounded-2xl overflow-hidden border border-pink-100 bg-white group relative"
            onClick={() => setOpenIdx(i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={src}
              alt={`photo-${i}`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs">🔍 ดูรูปใหญ่</span>
            </div>
          </motion.button>
        ))}
      </div>
      <Lightbox
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        src={openIdx !== null ? images[openIdx] : ""}
        hasPrev={openIdx > 0}
        hasNext={openIdx < images.length - 1}
        onPrev={() => setOpenIdx((i) => i - 1)}
        onNext={() => setOpenIdx((i) => i + 1)}
      />
    </>
  );
}

/* ---------- Image Cards ---------- */
function ImageCards({ cards = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="rounded-3xl border border-pink-200/60 bg-white/70 backdrop-blur-sm shadow-soft p-5 sm:p-6">
      <SectionTitle
        icon={<Sparkles className="w-6 h-6 text-primary" />}
        title="รูปพิเศษของเรา"
        subtitle="แตะการ์ดเพื่อดูรูปใหญ่"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <motion.button
            key={i}
            className="group relative rounded-2xl overflow-hidden bg-white border border-pink-100"
            style={{ aspectRatio: "5/4" }}
            onClick={() => setOpen(i)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <img
              src={c.src}
              alt={c.caption || `image-${i}`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-xs font-medium text-left">{c.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>
      <Lightbox
        open={open !== null}
        onClose={() => setOpen(null)}
        src={open !== null ? cards[open].src : ""}
        caption={open !== null ? cards[open].caption : ""}
        hasPrev={open > 0}
        hasNext={open < cards.length - 1}
        onPrev={() => setOpen((i) => i - 1)}
        onNext={() => setOpen((i) => i + 1)}
      />
    </div>
  );
}

/* ---------- Timeline ---------- */
function Timeline({ milestones = [], images = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="rounded-3xl border border-pink-200/60 bg-white/70 backdrop-blur-sm shadow-soft p-5 sm:p-6">
      <SectionTitle
        icon={<Camera className="w-6 h-6 text-primary" />}
        title="ไทม์ไลน์ความทรงจำ"
        subtitle="คลิกการ์ดเพื่อดูรูปเต็ม"
      />
      <div className="relative pl-6">
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-300 via-pink-300 to-transparent rounded-full" />
        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <motion.div
              key={idx}
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Dot */}
              <div className="absolute -left-4 top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary shadow-sm" />

              <button
                onClick={() => setOpen(idx)}
                className="w-full text-left group grid md:grid-cols-5 gap-3 p-4 rounded-2xl bg-white border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300"
              >
                <div className="md:col-span-2 flex flex-col justify-center">
                  <span className="inline-block text-xs text-dark/50 font-medium mb-1">
                    {new Date(m.date).toLocaleDateString("th-TH", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                  <div className="font-semibold text-base text-primary">{m.title}</div>
                  <p className="text-dark/70 mt-1 text-sm leading-relaxed">{m.note}</p>
                </div>
                <div className="md:col-span-3">
                  <div className="relative w-full overflow-hidden rounded-xl aspect-[4/3] md:aspect-[16/9]">
                    <img
                      src={images[m.imageIndex]}
                      alt={m.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        open={open !== null}
        onClose={() => setOpen(null)}
        src={open !== null ? images[milestones[open]?.imageIndex] : ""}
        caption={open !== null ? `${milestones[open]?.title} — ${milestones[open]?.note}` : ""}
        hasPrev={open > 0}
        hasNext={open < milestones.length - 1}
        onPrev={() => setOpen((i) => i - 1)}
        onNext={() => setOpen((i) => i + 1)}
      />
    </div>
  );
}

/* ---------- Section Title ---------- */
function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-end gap-2.5 mb-5">
      <div className="p-2 rounded-xl bg-violet-50 border border-violet-100">{icon}</div>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-primary leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-dark/50 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ---------- Login Gate ---------- */
function AnniversaryGate({ expectedDate, onUnlock }) {
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("anniv_unlocked") === "1") onUnlock();
  }, [onUnlock]);

  const handleEnter = () => {
    const norm = (s) => (s || "").trim();
    if (norm(value) === norm(expectedDate)) {
      if (remember) sessionStorage.setItem("anniv_unlocked", "1");
      onUnlock();
    } else {
      setError("วันที่ไม่ตรง ลองใหม่นะคะ 🥺");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #FFF0F8 0%, #F3E8FF 50%, #FFF0F8 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-3xl border border-pink-200/80 bg-white/90 backdrop-blur-xl shadow-2xl p-7 text-center">
          {/* Icon */}
          <motion.div
            className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center shadow-soft"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="w-7 h-7 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-bold text-primary mb-1">ยินดีต้อนรับ 💕</h2>
          <p className="text-sm text-dark/60 mb-6">
            กรอกวันที่เราเริ่มคบกันเพื่อเข้าชม
          </p>

          <input
            type="date"
            className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50/50 text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-xs mt-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-4 mb-5">
            <label className="text-sm flex items-center gap-2 text-dark/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-primary"
              />
              จำฉันไว้
            </label>
          </div>

          <motion.button
            onClick={handleEnter}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary to-pink-500 text-white font-semibold shadow-soft hover:shadow-soft-hover transition-all"
          >
            <Unlock className="w-4 h-4" /> เข้าชมเลย
          </motion.button>

          <p className="text-xs text-dark/30 mt-4">only you know 🤍</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Hero Section ---------- */
function HeroSection({ config, togetherMonths, onBurst }) {
  return (
    <section className="grid md:grid-cols-2 gap-6 items-center w-full">
      <div className="w-full">
        {/* Names badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-sm text-pink-600 font-medium mb-4"
        >
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
          {config.yourName} & {config.partnerName}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
        >
          Happy{" "}
          <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            {togetherMonths} Months
          </span>
          <br />
          Anniversary 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base md:text-lg text-dark/70 leading-relaxed"
        >
          เราอยู่ด้วยกันมาแล้ว{" "}
          <span className="font-bold text-primary">{togetherMonths} เดือน</span>{" "}
          และยังมีความทรงจำอีกมากที่รอเราอยู่ 💫
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBurst}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-gradient-to-r from-primary to-pink-500 shadow-soft hover:shadow-soft-hover font-semibold transition-all"
          >
            <Heart className="w-5 h-5 fill-white" /> รักนะ 💕
          </motion.button>

          <a
            href="#timeline"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-pink-200 text-dark/70 hover:bg-pink-50 hover:border-pink-300 transition-all font-medium"
          >
            ดูความทรงจำ →
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Countdown startDate={config.anniversaryDate} />
      </motion.div>
    </section>
  );
}

/* ---------- Main Page ---------- */
export default function AnniversarySite() {
  const config = DEFAULT_CONFIG;
  const [burst, setBurst] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const annivDate = useMemo(
    () => new Date(config.anniversaryDate + "T00:00:00+07:00"),
    [config.anniversaryDate]
  );
  const togetherMonths = useMemo(() => monthsBetween(annivDate, new Date()), [annivDate]);

  const triggerBurst = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 2300);
  };

  return (
    <div className="min-h-screen bg-transparent text-dark overflow-x-hidden">
      <FloatingPetals />

      {!unlocked && (
        <AnniversaryGate
          expectedDate={config.anniversaryDate}
          onUnlock={() => setUnlocked(true)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-md border-b border-pink-100/80 w-full">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-pink-500 fill-pink-400" />
            </motion.div>
            <span className="text-dark/80">
              {config.yourName} ❤️ {config.partnerName}
            </span>
          </div>
          <MusicPlayer url={config.songUrl} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-14 space-y-8 sm:space-y-10">
        <HeroSection
          config={config}
          togetherMonths={togetherMonths}
          onBurst={triggerBurst}
        />

        <section id="timeline">
          <Timeline milestones={config.milestones} images={config.images} />
        </section>

        <section>
          <div className="rounded-3xl border border-pink-200/60 bg-white/70 backdrop-blur-sm shadow-soft p-5 sm:p-6">
            <SectionTitle
              icon={<Camera className="w-6 h-6 text-primary" />}
              title="แกลเลอรีของเรา"
              subtitle="กดเพื่อขยายรูป"
            />
            <Gallery images={config.images} />
          </div>
        </section>

        <section>
          <ImageCards cards={config.imageCards} />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 text-dark/40 text-sm">
          made with <span className="text-pink-400">♥</span> for us
        </footer>
      </main>

      <AnimatePresence>
        {burst && <HeartBurst onDone={() => setBurst(false)} />}
      </AnimatePresence>
    </div>
  );
}
