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

        <section className="guide-intro">
          <p className="guide-eyebrow">VỀ CÔNG CỤ NÀY</p>
          <h1>CV Builder giúp bạn làm gì?</h1>
          <p>
            Định dạng Harvard là chuẩn CV được các trường đại học, công ty
            công nghệ và nhà tuyển dụng quốc tế ưa chuộng nhất — gọn, rõ
            ràng, tập trung hoàn toàn vào nội dung chuyên môn.
          </p>

          <div className="guide-purpose-grid">
            <div className="guide-purpose-card">
              <span className="guide-purpose-number">01</span>
              <h3>Viết CV mới từ đầu</h3>
              <p>
                Điền thông tin theo từng mục có sẵn, công cụ tự động canh
                chỉnh bố cục chuẩn Harvard — bạn chỉ cần lo nội dung.
              </p>
            </div>

            <div className="guide-purpose-card">
              <span className="guide-purpose-number">02</span>
              <h3>Chuyển đổi CV đang có</h3>
              <p>
                Đã có CV dạng khác (Canva, Word, template khác)? Import file
                PDF, AI tự đọc và viết lại đúng bố cục Harvard.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-tip-highlight">
          <span className="guide-tip-badge">MẸO NHANH</span>
          <h2>Đã có CV rồi? Đừng gõ lại</h2>
          <p>
            Nhấn <strong>Import PDF</strong> ở góc trên bên phải để tải CV
            hiện tại lên. AI sẽ đọc nội dung và tự động sắp xếp lại đúng
            format Harvard — bạn chỉ cần rà soát và tinh chỉnh trước khi lưu.
          </p>
        </section>

        <section className="guide-section">
          <h2>Xem trước theo thời gian thực</h2>
          <p>
            Khung bên phải luôn hiển thị <strong>Live Preview</strong> — mọi
            thay đổi cập nhật ngay lập tức khi bạn gõ.
          </p>
          <ul className="guide-list">
            <li><strong>Web Preview</strong> — xem nhanh dạng HTML.</li>
            <li><strong>PDF View</strong> — xem đúng bản PDF sẽ được tải xuống, chuẩn khổ A4.</li>
            <li><strong>Download PDF</strong> — tải file CV về máy, khớp đúng nội dung trong PDF View.</li>
          </ul>
        </section>

        <div className="guide-cta">
          <Link href="/builder" className="primary-button">
            Bắt đầu tạo CV
          </Link>
        </div>

      </main>

    </div>
  );
}