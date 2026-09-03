import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";

export const metadata = {
  title: "Hướng dẫn sử dụng - CV Builder",
};

export default function GuidePage() {
  return (
    <div className="guide-page">

      <header className="guide-header">
        <Link href="/builder" className="back-button">
          <HiArrowLeft />
        </Link>

        <div className="builder-title">
          <strong>Hướng dẫn sử dụng</strong>
          <span>Tạo CV chuẩn Harvard chỉ trong vài phút</span>
        </div>
      </header>

      <main className="guide-content">

        {/* INTRO */}
        <section className="guide-intro">
          <h1>Tạo CV chuẩn Harvard chỉ trong vài phút</h1>

          <p>
            CV Builder sử dụng định dạng Harvard — bố cục gọn gàng,
            rõ ràng và tập trung vào chuyên môn, giúp bạn tạo CV
            chuyên nghiệp một cách nhanh chóng.
          </p>
        </section>


        {/* QUICK TIP */}
        <section className="guide-tip-highlight">
          <span className="guide-tip-badge">MẸO NHANH</span>

          <h2>Đã có CV? Đừng gõ lại.</h2>

          <p>
            Nhấn <strong>Import PDF</strong> ở góc trên bên phải để tải
            CV lên. AI sẽ tự động đọc nội dung và sắp xếp theo
            format Harvard. Bạn chỉ cần kiểm tra và chỉnh sửa.
          </p>
        </section>


        {/* STEPS */}
        <section className="guide-section">

          <h2>01 — Nhập thông tin</h2>

          <p>
            Điền các thông tin cần thiết như cá nhân, học vấn,
            kinh nghiệm, kỹ năng và dự án.
          </p>

        </section>


        <section className="guide-section">

          <h2>02 — Chỉnh sửa</h2>

          <p>
            Kiểm tra nội dung, bổ sung thông tin và hoàn thiện CV
            theo nhu cầu của bạn.
          </p>

        </section>


        <section className="guide-section">

          <h2>03 — Xuất CV</h2>

          <p>
          Xem trước CV, kiểm tra lần cuối và tải xuống bản PDF chất lượng cao — sẵn sàng để ứng tuyển.
          </p>

        </section>


        {/* CTA */}
        <div className="guide-cta">
          <Link href="/builder" className="primary-button">
            Bắt đầu tạo CV
          </Link>
        </div>

      </main>
    </div>
  );
}

