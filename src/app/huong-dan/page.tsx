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
            Định dạng Harvard là chuẩn trình bày CV được các trường đại học,
            công ty công nghệ và nhà tuyển dụng quốc tế ưa chuộng nhất — gọn,
            rõ ràng, không rườm rà, tập trung hoàn toàn vào nội dung chuyên môn.
            Công cụ này giúp bạn đạt được chuẩn đó theo 2 cách:
          </p>

          <div className="guide-purpose-grid">
            <div className="guide-purpose-card">
              <span className="guide-purpose-number">01</span>
              <h3>Viết CV mới từ đầu</h3>
              <p>
                Chưa có CV, hoặc CV hiện tại quá sơ sài? Điền thông tin theo
                từng mục có sẵn, công cụ tự động canh chỉnh bố cục đúng chuẩn
                Harvard — bạn chỉ cần tập trung vào nội dung.
              </p>
            </div>

            <div className="guide-purpose-card">
              <span className="guide-purpose-number">02</span>
              <h3>Chuyển đổi CV đang có</h3>
              <p>
                Đã có CV ở định dạng khác (Canva, Word, template khác)? Dùng
                tính năng <strong>Import PDF</strong> để AI tự đọc và điền lại
                toàn bộ nội dung theo đúng bố cục Harvard, không cần gõ lại
                từ đầu.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Bắt đầu với CV mới</h2>
          <p>
            Nhấn <strong>New CV</strong> ở góc trên bên phải để mở một bản CV
            trống, rồi lần lượt điền thông tin qua các tab bên trái:
          </p>
          <ul className="guide-list">
            <li><strong>Personal</strong> — Họ tên, chức danh, email, số điện thoại, GitHub, LinkedIn.</li>
            <li><strong>Summary</strong> — 2–4 câu giới thiệu bản thân, nêu bật định hướng nghề nghiệp.</li>
            <li><strong>Education</strong> — Trường học, chuyên ngành, GPA, thời gian học.</li>
            <li><strong>Experience</strong> — Công việc, thực tập; mỗi vị trí nên có 2–4 gạch đầu dòng nêu kết quả cụ thể, có số liệu càng tốt.</li>
            <li><strong>Projects</strong> — Dự án cá nhân hoặc nhóm, công nghệ sử dụng, link demo nếu có.</li>
            <li><strong>Skills</strong> — Ngôn ngữ, framework, công cụ, database, cloud — chia theo nhóm rõ ràng.</li>
            <li><strong>Certifications</strong> — Chứng chỉ chuyên môn, đơn vị cấp, năm đạt được.</li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>Chuyển đổi CV có sẵn sang Harvard</h2>
          <p>
            Nếu đã có CV dạng PDF (dù đang trình bày theo phong cách nào), nhấn{" "}
            <strong>Import PDF</strong> ở góc trên bên phải. Hệ thống sẽ:
          </p>
          <ul className="guide-list">
            <li>Đọc toàn bộ nội dung văn bản trong file PDF.</li>
            <li>Dùng AI phân tích và sắp xếp lại đúng theo cấu trúc Harvard (Summary → Education → Experience → Projects → Skills → Certifications).</li>
            <li>Tự động điền vào từng tab tương ứng — bạn chỉ cần rà soát và tinh chỉnh lại.</li>
          </ul>
          <p className="guide-note">
            Lưu ý: chỉ hoạt động với PDF chứa văn bản thật (được gõ ra), không
            hỗ trợ file ảnh chụp hoặc bản scan. Sau khi import, nên kiểm tra kỹ
            từng mục vì độ chính xác phụ thuộc vào cách trình bày của file gốc.
          </p>
        </section>

        <section className="guide-section">
          <h2>Xem trước theo thời gian thực</h2>
          <p>
            Khung bên phải luôn hiển thị <strong>Live Preview</strong> — mọi
            thay đổi cập nhật ngay lập tức khi bạn gõ. Có 2 chế độ xem:
          </p>
          <ul className="guide-list">
            <li><strong>Web Preview</strong> — xem nhanh dạng HTML.</li>
            <li><strong>PDF View</strong> — xem đúng bản PDF sẽ được tải xuống, chuẩn khổ A4.</li>
          </ul>
          <p>
            Kéo thanh chia đôi giữa 2 khung để điều chỉnh kích thước theo ý
            muốn khi cần nhìn rõ hơn phần nào đó.
          </p>
        </section>

        <section className="guide-section">
          <h2>Lưu, cập nhật và tải xuống</h2>
          <ul className="guide-list">
            <li><strong>Save CV / Update CV</strong> — lưu lại toàn bộ nội dung, thời gian lưu gần nhất hiện ở góc trên phải.</li>
            <li><strong>Download PDF</strong> — tải file PDF về máy, đúng với nội dung trong PDF View.</li>
            <li><strong>Delete</strong> — xóa hẳn CV đang mở (không thể hoàn tác, có xác nhận trước khi xóa).</li>
          </ul>
        </section>

        <section className="guide-tips">
          <h2>Vài lưu ý để CV nổi bật hơn</h2>
          <ul className="guide-list">
            <li>Mỗi gạch đầu dòng trong Experience/Projects nên bắt đầu bằng động từ hành động (Xây dựng, Triển khai, Tối ưu...) và có số liệu cụ thể khi có thể.</li>
            <li>Giữ CV trong giới hạn 1 trang nếu dưới 5 năm kinh nghiệm.</li>
            <li>Ưu tiên liệt kê dự án/kinh nghiệm liên quan trực tiếp đến vị trí ứng tuyển lên đầu.</li>
            <li>Kiểm tra chính tả và định dạng ngày tháng nhất quán trước khi tải xuống.</li>
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