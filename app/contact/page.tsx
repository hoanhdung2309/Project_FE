"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const INTERESTS = [
  "Mua thanh long lẻ",
  "Đăng ký đại lý sỉ",
  "Hợp tác xuất khẩu",
  "Phản ánh chất lượng",
  "Khác",
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    iconBg: "bg-pitaya-50",
    iconColor: "text-pitaya-500",
    label: "Địa chỉ nông trại",
    value: "123 Đường Thanh Long, Hàm Thuận Nam, Bình Thuận",
    href: undefined,
  },
  {
    icon: Phone,
    iconBg: "bg-cactus-100",
    iconColor: "text-cactus-600",
    label: "Hotline hỗ trợ sỉ",
    value: "090 123 4567",
    href: "tel:0901234567",
  },
  {
    icon: Mail,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    label: "Email liên hệ",
    value: "lienhe@pitaya.vn",
    href: "mailto:lienhe@pitaya.vn",
  },
  {
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    label: "Giờ làm việc",
    value: "07:00 – 21:00 · Thứ 2 – Chủ nhật",
    href: undefined,
  },
];

/* Stylised map SVG (no API key needed) */
function MapPlaceholder() {
  return (
    <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
      <svg viewBox="0 0 400 200" className="w-full h-full" aria-hidden="true">
        {/* Grid */}
        {[0,40,80,120,160,200].map(y => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {[0,50,100,150,200,250,300,350,400].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {/* Roads */}
        <path d="M0 100 Q100 80 200 100 Q300 120 400 100" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M200 0 Q210 100 200 200" stroke="#cbd5e1" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M0 50 Q80 60 150 50 Q200 45 250 60 Q320 75 400 65" stroke="#e2e8f0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M50 200 Q80 140 100 100 Q120 60 150 0" stroke="#e2e8f0" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Green areas */}
        <ellipse cx="300" cy="60" rx="55" ry="35" fill="#dcfce7" opacity=".7" />
        <ellipse cx="80"  cy="150" rx="40" ry="25" fill="#dcfce7" opacity=".5" />
        {/* Location pin */}
        <circle cx="200" cy="100" r="18" fill="#e8196f" opacity=".15" />
        <circle cx="200" cy="100" r="10" fill="#e8196f" opacity=".3" />
        <circle cx="200" cy="100" r="5"  fill="#e8196f" />
        {/* Pin needle */}
        <path d="M200 105 L200 118" stroke="#e8196f" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {/* Overlay label */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-pitaya-500 shrink-0" />
        <span className="text-xs font-semibold text-dragon-dark">Hàm Thuận Nam, Bình Thuận</span>
      </div>
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs font-semibold text-pitaya-600 hover:text-pitaya-700 border border-pitaya-100 transition-colors shadow-sm"
      >
        Mở Google Maps ↗
      </a>
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", interest: INTERESTS[0], message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Vui lòng nhập họ và tên.";
    if (!form.phone.trim())   e.phone   = "Vui lòng nhập số điện thoại.";
    if (!form.message.trim()) e.message = "Vui lòng nhập lời nhắn.";
    return e;
  }

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    /* Simulate API call */
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-dragon-base">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Page header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-2">Liên hệ</p>
          <h1 className="text-3xl sm:text-4xl font-black text-dragon-dark mb-4">
            Liên Hệ Với Pitaya
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Thắc mắc về bảng giá sỉ hay chất lượng sản phẩm? Đội ngũ của chúng tôi
            phản hồi trong vòng <span className="font-semibold text-pitaya-600">15 phút</span>.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(232,25,111,0.08), 0 4px 16px rgba(0,0,0,0.06)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* ── Left: Shop info ── */}
            <div className="p-8 sm:p-10 bg-gradient-to-br from-dragon-base to-white border-b md:border-b-0 md:border-r border-slate-100">
              <h2 className="text-xl font-black text-pitaya-600 mb-7">Thông tin đại lý</h2>

              <div className="space-y-5 mb-8">
                {CONTACT_INFO.map(({ icon: Icon, iconBg, iconColor, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className={`${iconBg} p-2.5 rounded-2xl shrink-0`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                      <p className="font-bold text-dragon-dark text-sm">{label}</p>
                      {href ? (
                        <a href={href} className="text-slate-500 text-sm hover:text-pitaya-600 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-slate-500 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Kết nối nhanh</p>
                <div className="flex gap-3">
                  {/* Zalo */}
                  <a href="#" aria-label="Zalo"
                    className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-blue-200">
                    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
                      <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm3.95 20.3c-1.02.27-2.05.4-3.1.4-5.26 0-9.54-3.76-9.54-8.7 0-4.94 4.28-8.7 9.54-8.7 5.26 0 9.54 3.76 9.54 8.7 0 2.76-1.4 5.22-3.62 6.88l.5 2.5-3.32-1.08z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="#" aria-label="Facebook"
                    className="w-10 h-10 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-blue-200">
                    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
                      <path d="M16 2C8.268 2 2 8.268 2 16c0 7.015 5.146 12.836 11.875 13.854V20.08h-3.574V16h3.574v-3.097c0-3.524 2.1-5.472 5.314-5.472 1.54 0 3.15.275 3.15.275v3.463h-1.775c-1.748 0-2.293 1.085-2.293 2.198V16h3.906l-.625 4.08h-3.281v9.774C24.854 28.836 30 23.015 30 16 30 8.268 23.732 2 16 2z" />
                    </svg>
                  </a>
                  {/* Messenger */}
                  <a href="#" aria-label="Messenger"
                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    style={{ background: "linear-gradient(135deg, #0099ff, #a033ff)" }}>
                    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
                      <path d="M16 2C8.268 2 2 7.925 2 15.18c0 4.13 1.96 7.81 5.02 10.27V30l4.63-2.54c1.24.34 2.55.52 3.91.52 7.732 0 14-5.925 14-13.18S23.732 2 16 2zm1.39 17.73l-3.56-3.8-6.95 3.8 7.65-8.12 3.64 3.8 6.87-3.8-7.65 8.12z" />
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a href="#" aria-label="TikTok"
                    className="w-10 h-10 rounded-xl bg-dragon-dark hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm">
                    <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
                      <path d="M21.6 6.4a4.8 4.8 0 01-4.8-4.8h-2.4v16.8a2.4 2.4 0 11-2.4-2.4v-2.4a4.8 4.8 0 104.8 4.8V10.8a7.15 7.15 0 004.2 1.36V9.76a4.83 4.83 0 01-3.6-1.56 4.8 4.8 0 00-.6-.56 4.8 4.8 0 01.8.76v-2z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Map */}
              <MapPlaceholder />
            </div>

            {/* ── Right: Form ── */}
            <div className="p-8 sm:p-10 bg-gradient-to-br from-[#fff5f8] to-white">
              {done ? (
                /* Success state */
                <div className="h-full flex flex-col items-center justify-center text-center py-8 gap-5">
                  <div className="w-20 h-20 rounded-full bg-cactus-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-cactus-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-dragon-dark mb-2">Đã nhận thông tin!</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Cảm ơn bạn đã liên hệ. Đội ngũ Pitaya sẽ phản hồi trong vòng
                      <span className="font-semibold text-pitaya-600"> 15 phút</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => { setDone(false); setForm({ name: "", phone: "", interest: INTERESTS[0], message: "" }); }}
                    className="mt-2 text-sm font-semibold text-pitaya-600 hover:text-pitaya-700 underline underline-offset-4 transition-colors"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-dragon-dark mb-7">Để lại lời nhắn</h2>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Name */}
                    <div>
                      <label className="text-sm font-bold text-dragon-dark mb-1.5 block">
                        Họ và tên <span className="text-pitaya-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border bg-white text-sm text-dragon-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pitaya-500 transition-all ${
                          errors.name ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm font-bold text-dragon-dark mb-1.5 block">
                        Số điện thoại <span className="text-pitaya-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="090 123 4567"
                        value={form.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border bg-white text-sm text-dragon-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pitaya-500 transition-all ${
                          errors.phone ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Interest */}
                    <div>
                      <label className="text-sm font-bold text-dragon-dark mb-1.5 block">
                        Bạn quan tâm đến?
                      </label>
                      <select
                        value={form.interest}
                        onChange={e => handleChange("interest", e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-dragon-dark focus:outline-none focus:ring-2 focus:ring-pitaya-500 transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1rem", paddingRight: "2.5rem" }}
                      >
                        {INTERESTS.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-sm font-bold text-dragon-dark mb-1.5 block">
                        Lời nhắn <span className="text-pitaya-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Nội dung cần hỗ trợ, số lượng dự kiến mua, vùng giao hàng..."
                        value={form.message}
                        onChange={e => handleChange("message", e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl border bg-white text-sm text-dragon-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pitaya-500 transition-all resize-none ${
                          errors.message ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                        }`}
                      />
                      {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 text-white font-black py-3.5 rounded-2xl text-sm transition-all active:scale-95 disabled:opacity-70"
                      style={{
                        background: "linear-gradient(135deg, #e8196f 0%, #c5135d 100%)",
                        boxShadow: "0 8px 24px rgba(232,25,111,0.35)",
                      }}
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          GỬI THÔNG TIN NGAY
                        </>
                      )}
                    </button>

                    <p className="text-xs text-slate-400 text-center">
                      Thông tin của bạn được bảo mật tuyệt đối. Không spam.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
