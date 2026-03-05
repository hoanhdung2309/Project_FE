import { MapPin, Sprout, CheckCircle, Award, Leaf, Droplets, Sun, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ── Data ── */
const STORY_CARDS = [
  {
    icon: MapPin,
    iconColor: "text-pitaya-500",
    bgFrom: "from-pitaya-50",
    borderHover: "hover:border-pitaya-200",
    title: "Vùng Nguyên Liệu",
    short: "Tọa lạc tại vùng đất Bình Thuận đầy nắng, nơi có khí hậu và thổ nhưỡng lý tưởng nhất cho cây thanh long.",
    full: "Tọa lạc tại vùng đất Bình Thuận đầy nắng, nơi có khí hậu và thổ nhưỡng lý tưởng nhất cho sự phát triển của cây thanh long. Với diện tích hơn 50 hecta, chúng tôi quản lý quy trình khép kín từ khâu chọn giống đến khi thu hoạch, đảm bảo mỗi trái thanh long đều mang trọn vẹn hương vị đặc trưng của vùng đất này.",
  },
  {
    icon: Sprout,
    iconColor: "text-cactus-600",
    bgFrom: "from-cactus-100",
    borderHover: "hover:border-cactus-500",
    title: "Canh Tác Hữu Cơ",
    short: "Áp dụng tiêu chuẩn canh tác nghiêm ngặt, hạn chế tối đa phân bón hóa học và thuốc trừ sâu.",
    full: "Chúng tôi áp dụng các tiêu chuẩn canh tác nghiêm ngặt, hạn chế tối đa phân bón hóa học và thuốc trừ sâu. Toàn bộ nguồn nước tưới được lọc sạch và hệ thống tưới nhỏ giọt tự động giúp tiết kiệm tài nguyên, đồng thời cung cấp đúng lượng dinh dưỡng cần thiết cho từng giai đoạn sinh trưởng.",
  },
  {
    icon: CheckCircle,
    iconColor: "text-blue-500",
    bgFrom: "from-blue-50",
    borderHover: "hover:border-blue-200",
    title: "Chất Lượng Xuất Khẩu",
    short: "Sản phẩm tuyển chọn kỹ lưỡng, đạt kích thước và độ đường chuẩn cho các thị trường khó tính.",
    full: "Sản phẩm được tuyển chọn kỹ lưỡng, đạt kích thước và độ đường chuẩn để đáp ứng các thị trường khó tính nhất như Châu Âu, Nhật Bản và Hoa Kỳ. Tỷ lệ hàng đạt chuẩn loại 1 luôn trên 90%, được kiểm định bởi các tổ chức quốc tế độc lập.",
  },
];

const CERTS = [
  {
    label: "VietGAP",
    sub: "Cấp 2023",
    detail: "Thực hành sản xuất nông nghiệp tốt tại Việt Nam – đảm bảo vệ sinh an toàn thực phẩm, truy xuất nguồn gốc và bảo vệ môi trường.",
  },
  {
    label: "GlobalGAP",
    sub: "Cấp 2022",
    detail: "Tiêu chuẩn toàn cầu về quản lý nông trại, an toàn thực phẩm và truy xuất nguồn gốc. Bắt buộc để xuất khẩu vào EU và Nhật Bản.",
  },
  {
    label: "HACCP",
    sub: "Cấp 2023",
    detail: "Hệ thống phân tích mối nguy và kiểm soát điểm tới hạn trong chế biến – giảm thiểu rủi ro an toàn thực phẩm ở mọi công đoạn.",
  },
  {
    label: "ISO 22000",
    sub: "Cấp 2024",
    detail: "Tiêu chuẩn hệ thống quản lý an toàn thực phẩm quốc tế, tích hợp nguyên tắc HACCP và yêu cầu quản lý chất lượng toàn diện.",
  },
];

const STATS = [
  { value: "50+", label: "Hecta canh tác", icon: MapPin },
  { value: "12+", label: "Năm kinh nghiệm", icon: Sun },
  { value: "90%", label: "Hàng loại 1", icon: CheckCircle },
  { value: "15+", label: "Thị trường xuất khẩu", icon: Leaf },
];

const QUALITIES = [
  { icon: Droplets, label: "Độ đường Brix 18–22°", desc: "Ngọt tự nhiên, không chất bảo quản" },
  { icon: Leaf, label: "Không thuốc trừ sâu", desc: "Canh tác hữu cơ theo tiêu chuẩn GAP" },
  { icon: ShieldCheck, label: "Truy xuất nguồn gốc", desc: "QR code từng lô hàng, minh bạch 100%" },
  { icon: Sun, label: "Thu hoạch đúng độ chín", desc: "Kiểm soát thời điểm thu hoạch chuẩn xác" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-dragon-dark">
      <Header />

      {/* ── 1. Hero ── */}
      <section className="relative h-[65vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        {/* Gradient background thay cho ảnh thực */}
        <div className="absolute inset-0 bg-gradient-to-br from-cactus-600 via-pitaya-600 to-pitaya-700" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5" />
        {/* SVG dragon fruit silhouette */}
        <svg
          className="absolute right-12 bottom-0 h-[90%] opacity-10 hidden lg:block"
          viewBox="0 0 200 320"
          fill="none"
        >
          <ellipse cx="100" cy="200" rx="80" ry="100" fill="white" />
          <ellipse cx="100" cy="205" rx="55" ry="72" fill="white" opacity=".6" />
          <path d="M100 100 C85 60 60 70 65 100" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 100 C115 60 140 70 135 100" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 100 C100 55 100 70 100 100" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 100 C78 70 55 85 62 108" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 100 C122 70 145 85 138 108" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70 mb-4">
            Pitaya Farm · Bình Thuận
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
            Tâm Hồn <br className="sm:hidden" />
            <span className="text-pitaya-200">Nông Sản Việt</span>
          </h1>
          <p className="text-base sm:text-lg font-light text-white/85 max-w-xl mx-auto leading-relaxed">
            Hơn cả một trái cây — đó là kết tinh của nắng gió, tình yêu đất mẹ và hơn 12 năm tâm huyết.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/shop"
              className="bg-white text-pitaya-600 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-pitaya-50 transition-colors shadow-md"
            >
              Xem sản phẩm
            </Link>
            <a
              href="#story"
              className="border border-white/50 text-white font-medium px-6 py-2.5 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Câu chuyện của chúng tôi ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Stats strip ── */}
      <div className="bg-dragon-dark text-white">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="w-5 h-5 text-pitaya-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Our Story ── */}
      <section id="story" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-2">Câu chuyện của chúng tôi</p>
          <h2 className="text-3xl sm:text-4xl font-black">Từ Đất Mẹ Đến Bàn Ăn</h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            Mỗi trái thanh long là một hành trình — rê chuột vào thẻ để đọc thêm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`group relative p-8 bg-gradient-to-b ${card.bgFrom} to-white rounded-3xl border-2 border-transparent ${card.borderHover} transition-all duration-300 cursor-default overflow-hidden`}
              >
                {/* Normal content */}
                <div className="transition-opacity duration-300 group-hover:opacity-0">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{card.short}</p>
                  <p className="mt-4 text-xs text-slate-400 font-medium">Hover để đọc thêm →</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 p-8 bg-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center shadow-xl pointer-events-none group-hover:pointer-events-auto">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{card.full}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Product quality ── */}
      <section className="bg-dragon-base py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Illustration */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pitaya-100 to-pitaya-200 animate-pulse" />
                {/* Dragon fruit cross-section SVG */}
                <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full drop-shadow-xl">
                  {/* White flesh */}
                  <circle cx="100" cy="100" r="88" fill="white" />
                  {/* Outer skin */}
                  <circle cx="100" cy="100" r="96" fill="none" stroke="#e8196f" strokeWidth="16" />
                  {/* Pink flesh gradient */}
                  <circle cx="100" cy="100" r="82" fill="#fce7f3" />
                  <circle cx="100" cy="100" r="60" fill="#fbcfe8" />
                  <circle cx="100" cy="100" r="38" fill="#f9a8d4" opacity=".7" />
                  {/* Seeds */}
                  {[
                    [100, 55], [130, 65], [148, 90], [145, 118],
                    [128, 140], [100, 148], [72, 140], [55, 118],
                    [52, 90], [70, 65],
                    [115, 80], [135, 100], [120, 125], [100, 132],
                    [80, 125], [65, 100], [80, 78],
                  ].map(([cx, cy], i) => (
                    <ellipse key={i} cx={cx} cy={cy} rx="3.5" ry="2.5"
                      transform={`rotate(${(i * 360) / 17}, ${cx}, ${cy})`}
                      fill="#1c1a2e" opacity=".5" />
                  ))}
                  {/* Skin spines */}
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    const r = (v: number) => Math.round(v * 1000) / 1000;
                    const x1 = r(100 + 88  * Math.cos(rad));
                    const y1 = r(100 + 88  * Math.sin(rad));
                    const x2 = r(100 + 104 * Math.cos(rad));
                    const y2 = r(100 + 104 * Math.sin(rad));
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8196f" strokeWidth="4" strokeLinecap="round" />;
                  })}
                </svg>
              </div>
            </div>

            {/* Quality points */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-2">Sản phẩm & Chất lượng</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-8">Đặc Tính Nổi Bật</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUALITIES.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-pitaya-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-pitaya-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-pitaya-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dragon-dark">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Certifications ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-2">Cam kết chất lượng</p>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Chứng Nhận Quốc Tế</h2>
          <p className="text-slate-500 text-sm mb-14 max-w-md mx-auto">
            Rê chuột vào từng chứng nhận để xem chi tiết.
          </p>

          <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
            {CERTS.map((cert) => (
              <div key={cert.label} className="group relative flex flex-col items-center">
                {/* Badge circle */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-slate-100 group-hover:border-pitaya-500 group-hover:shadow-pitaya-100 group-hover:shadow-lg transition-all duration-300 cursor-help">
                  <Award className="w-10 h-10 text-pitaya-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="block mt-3 font-black text-sm uppercase tracking-widest text-dragon-dark">
                  {cert.label}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">{cert.sub}</span>

                {/* Tooltip popup */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 p-3.5 bg-dragon-dark text-white text-xs rounded-2xl
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                -translate-y-1 group-hover:translate-y-0
                                transition-all duration-200 shadow-2xl z-10 text-left leading-relaxed">
                  {cert.detail}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-dragon-dark" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section className="bg-gradient-to-r from-pitaya-500 to-pitaya-700 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Sẵn sàng đặt hàng sỉ?</h2>
          <p className="text-white/80 text-sm mb-8">
            Giá tốt nhất theo từng mức sản lượng. Giao hàng toàn quốc và xuất khẩu.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/shop"
              className="bg-white text-pitaya-600 font-bold px-7 py-3 rounded-full text-sm hover:bg-pitaya-50 transition-colors shadow-lg"
            >
              Xem bảng giá sỉ
            </Link>
            <a
              href="#contact"
              className="border border-white/60 text-white font-medium px-7 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
