import { connectDB } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import PortfolioView from "@/components/portfolio/PortfolioView";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredId = process.env.FEATURED_RESUME_ID;

  let resume = null;

  if (featuredId) {
    await connectDB();
    const doc = await Resume.findById(featuredId).lean();
    if (doc) {
      resume = JSON.parse(JSON.stringify(doc));
    }
  }

  if (!resume) {
    return (
      <div className="portfolio-empty">
        <p>Chưa thiết lập CV để hiển thị.</p>
        <Link href="/builder" className="portfolio-cta-static">
          Tạo CV
        </Link>
      </div>
    );
  }

  return <PortfolioView resume={resume} />;
}