import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Music2,
  PauseCircle,
  CalendarDays,
  Camera,
  Sparkles,
  Lock,
  Unlock,
} from "lucide-react";

/* ---------- เอฟเฟกต์หัวใจลอย ---------- */
function HeartBurst({ onDone }) {
  useEffect(() => {
    const id = setTimeout(() => onDone?.(), 2000);
    return () => clearTimeout(id);
  }, [onDone]);

  const N = 18;
  const hearts = Array.from({ length: N });

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((_, i) => {
        const delay = 0.02 * i;
        const x = (Math.random() * 2 - 1) * 160; // กระจายซ้าย-ขวา
        const y = -120 - Math.random() * 160; // ลอยขึ้น
        const rot = (Math.random() * 2 - 1) * 25;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1, 1],
              x,
              y,
              rotate: rot,
            }}
            transition={{ duration: 1.8, delay, ease: "easeOut" }}
            className="absolute left-1/2 top-[60%]"
          >
            <Heart
              className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow"
              fill="currentColor"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- ค่าตั้งต้น ---------- */
const DEFAULT_CONFIG = {
  yourName: "Songpanon",
  partnerName: "Waranya",
  anniversaryDate: "2025-06-18",
  songUrl: "./src/sound/QLER- จีบ.mp3",
  images: [
    "./src/img/IMG_0453.jpg",
    "./src/img/IMG_1987.jpg",
    "./src/img/IMG_4716.JPG",
    "./src/img/IMG_5572.JPG",
    "./src/img/IMG_5579.JPG",
    "./src/img/IMG_4711.JPG",
  ],
  milestones: [
    {
      date: "2025-4-10",
      title: "วันแรกที่เจอกัน",
      note: "เจอกันครั้งแรกกกก 💓",
      imageIndex: 0,
    },
    {
      date: "2023-7-10",
      title: "1 เดือน",
      note: "เธอมาหา และเราไปเที่ยวด้วยกัน ✨",
      imageIndex: 2,
    },
    {
      date: "2025-8-10",
      title: "2 เดือน",
      note: "เธอมาหาเราอีกครั้ง และเราไปเที่ยวด้วยกัน 🏖️",
      imageIndex: 3,
    },
  ],
  imageCards: [
    { src: "./src/img/IMG_2368.jpg", caption: "ถ่ายโฟโต้บูธด้วยกัน 🌊" },
    {
      src: "./src/img/86B4C785-7414-49D6-B1AF-4F6B718E6062.JPG",
      caption: "เดินเล่นที่มอ 🌸",
    },
    { src: "./src/img/IMG_5574.JPG", caption: "ชอบรูปนี้มากกก 🐶" },
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

/* ---------- UI helpers ---------- */
function SoftCard({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl shadow-soft border border-accent/60 bg-white/80 backdrop-blur-sm ${className} hover:shadow-soft-hover transition-shadow`}
    >
      {children}
    </div>
  );
}
function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-end gap-2 sm:gap-3 mb-4 sm:mb-6">
      {icon}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-dark mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Countdown({ startDate }) {
  const target = React.useMemo(
    () => nextMonthlyAnniversary(new Date(startDate)),
    [startDate]
  );
  const { days, hours, minutes, seconds } = useCountdown(target);
  const nextDateStr = target.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <SoftCard className="p-4 sm:p-6 text-center w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <CalendarDays className="w-6 h-6 text-primary" />
        <h3 className="text-xl md:text-2xl font-semibold">
          นับถอยหลังวันครบรอบรายเดือน
        </h3>
      </div>
      <p className="text-sm text-dark mb-4">
        เจอกันอีกครั้งในวันที่ {nextDateStr}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "วัน", val: days },
          { label: "ชั่วโมง", val: hours },
          { label: "นาที", val: minutes },
          { label: "วินาที", val: seconds },
        ].map((b, i) => (
          <div
            key={i}
            className="rounded-xl px-3 py-3 sm:py-4 bg-white border border-accent"
          >
            <div className="text-2xl md:text-3xl font-extrabold tabular-nums">
              {String(b.val).padStart(2, "0")}
            </div>
            <div className="mt-1 text-xs md:text-sm text-dark">{b.label}</div>
          </div>
        ))}
      </div>
    </SoftCard>
  );
}

function MusicPlayer({ url }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => alert("กดอีกครั้งเพื่อเล่นเพลง"));
    }
  };
  if (!url) return null;
  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={url} preload="none" loop />
      <button
        onClick={toggle}
        className="px-3 py-2 rounded-full border border-accent hover:bg-secondary/20 text-sm"
      >
        {playing ? (
          <PauseCircle className="w-4 h-4" />
        ) : (
          <Music2 className="w-4 h-4" />
        )}{" "}
        <span className="ml-1">{playing ? "หยุดเพลง" : "เปิดเพลง"}</span>
      </button>
    </div>
  );
}

function Lightbox({ open, onClose, src, caption }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm grid place-items-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={caption || "photo"}
              className="w-full rounded-2xl shadow-2xl"
            />
            {caption && (
              <figcaption className="text-center text-white/90 mt-3 text-sm">
                {caption}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Gallery({ images = [] }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={i}
            className="aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden border border-accent bg-white group"
            onClick={() => setOpenIdx(i)}
          >
            <img
              src={src}
              alt={`photo-${i}`}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition"
            />
          </button>
        ))}
      </div>
      <Lightbox
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        src={openIdx !== null ? images[openIdx] : ""}
      />
    </>
  );
}

function ImageCards({ cards = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <SoftCard className="p-4 sm:p-6">
      <SectionTitle
        icon={<Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />}
        title="รูปพิเศษของเรา"
        subtitle="แตะการ์ดเพื่อดูรูปใหญ่"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <button
            key={i}
            className="aspect-[5/4] rounded-2xl border border-accent overflow-hidden bg-white group"
            onClick={() => setOpen(i)}
          >
            <img
              src={c.src}
              alt={c.caption || `image-${i}`}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          </button>
        ))}
      </div>
      <Lightbox
        open={open !== null}
        onClose={() => setOpen(null)}
        src={open !== null ? cards[open].src : ""}
        caption={open !== null ? cards[open].caption : ""}
      />
    </SoftCard>
  );
}

function Timeline({ milestones = [], images = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <SoftCard className="p-4 sm:p-6">
      <SectionTitle
        icon={<Camera className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />}
        title="ไทม์ไลน์ความทรงจำ"
        subtitle="คลิกการ์ดเพื่อดูรูปเต็ม"
      />
      <div className="relative pl-5 sm:pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-[3px] sm:w-1 bg-accent rounded-full" />
        <div className="space-y-4 sm:space-y-5">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[7px] top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border border-accent" />
              <button
                onClick={() => setOpen(idx)}
                className="w-full text-left group grid md:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-accent hover:shadow-sm transition"
              >
                <div className="md:col-span-2">
                  <div className="text-xs sm:text-sm text-dark">
                    {new Date(m.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="font-semibold text-base sm:text-lg mt-1 text-primary">
                    {m.title}
                  </div>
                  <p className="text-dark mt-1 text-sm">{m.note}</p>
                </div>
                <div className="md:col-span-3">
                  {/* กล่องรูป: เลือกอัตราส่วน 4:3 บนจอเล็ก และ 16:9 บนจอ md ขึ้นไป */}
                  <div className="relative w-full overflow-hidden rounded-lg aspect-[4/3] md:aspect-[16/9]">
                    {/* ให้รูปเติมเต็มกล่องโดยไม่บิดเบี้ยว */}
                    <img
                      src={images[m.imageIndex]}
                      alt={m.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition"
                    />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <Lightbox
        open={open !== null}
        onClose={() => setOpen(null)}
        src={open !== null ? images[milestones[open]?.imageIndex] : ""}
        caption={
          open !== null
            ? `${milestones[open]?.title} — ${milestones[open]?.note}`
            : ""
        }
      />
    </SoftCard>
  );
}

/* ---------- สกรีนล็อกอิน ---------- */
function AnniversaryGate({ expectedDate, onUnlock }) {
  const [value, setValue] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("anniv_unlocked") === "1") onUnlock();
  }, [onUnlock]);

  const handleEnter = () => {
    const norm = (s) => (s || "").trim();
    if (norm(value) === norm(expectedDate)) {
      if (remember) sessionStorage.setItem("anniv_unlocked", "1");
      onUnlock();
    } else {
      setError("วันที่ไม่ตรง ลองใหม่อีกครั้งนะ (รูปแบบ YYYY-MM-DD)");
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur grid place-items-center px-4">
      <SoftCard className="w-full max-w-md p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-primary">
            ปลดล็อกด้วย “วันครบรอบ”
          </h2>
        </div>
        <p className="text-sm text-dark mb-4">
          กรอกวันที่เราเริ่มคบกัน (รูปแบบ YYYY-MM-DD)
        </p>
        <input
          type="date"
          className="w-full px-3 py-2 rounded-lg border border-accent bg-white"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            จำฉันไว้วันนี้
          </label>
          <button
            onClick={handleEnter}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-[#6D28D9]"
          >
            <Unlock className="w-4 h-4" /> เข้าชม
          </button>
        </div>
      </SoftCard>
    </div>
  );
}

/* ---------- Page ---------- */
export default function AnniversarySite() {
  const config = DEFAULT_CONFIG;
  const [burst, setBurst] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const annivDate = useMemo(
    () => new Date(config.anniversaryDate + "T00:00:00+07:00"),
    [config.anniversaryDate]
  );
  const togetherMonths = useMemo(
    () => monthsBetween(annivDate, new Date()),
    [annivDate]
  );

  return (
    <div className="min-h-screen bg-transparent text-dark overflow-x-hidden">
      {!unlocked && (
        <AnniversaryGate
          expectedDate={config.anniversaryDate}
          onUnlock={() => setUnlocked(true)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-accent w-full">
        <div className="w-full px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-dark">
              {config.yourName} ❤ {config.partnerName}
            </span>
          </div>
          <MusicPlayer url={config.songUrl} />
        </div>
      </header>

      {/* Hero + Countdown */}
      <main className="w-full px-4 py-10 md:py-14">
        <section className="grid md:grid-cols-2 gap-6 items-center w-full">
          <div className="w-full">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Happy anniversary {togetherMonths} month
            </motion.h1>
            <p className="mt-4 text-base md:text-lg text-dark">
              วันนี้เราอยู่ด้วยกันมาแล้ว{" "}
              <span className="font-semibold text-primary">
                {togetherMonths}
              </span>{" "}
              เดือน 💫
            </p>

            {/* ปุ่มรักนะ – มี feedback + เรียกเอฟเฟกต์หัวใจ */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setBurst(true);
                  setTimeout(() => setBurst(false), 2100);
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-white bg-primary hover:bg-[#6D28D9] transition"
              >
                <Heart className="w-5 h-5" /> รักนะ
              </motion.button>

              <a
                href="#timeline"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-accent hover:bg-secondary/20"
              >
                ดูความทรงจำ
              </a>
            </div>
          </div>

          <Countdown startDate={config.anniversaryDate} />
        </section>

        {/* Timeline */}
        <section id="timeline" className="mt-8 sm:mt-10">
          <Timeline milestones={config.milestones} images={config.images} />
        </section>

        {/* Gallery */}
        <section className="mt-8 sm:mt-10">
          <SoftCard className="p-4 sm:p-6">
            <SectionTitle
              icon={<Camera className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />}
              title="แกลเลอรีของเรา"
              subtitle="กดเพื่อขยายรูป"
            />
            <Gallery images={config.images} />
          </SoftCard>
        </section>

        {/* Image cards */}
        <section className="mt-8 sm:mt-10">
          <ImageCards cards={config.imageCards} />
        </section>
      </main>

      {/* Hearts effect overlay */}
      <AnimatePresence>
        {burst && <HeartBurst onDone={() => setBurst(false)} />}
      </AnimatePresence>
    </div>
  );
}
