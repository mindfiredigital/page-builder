import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import '../css/custom.css';
import { HeroSection } from '../components/HomePage/HeroSection';
import { AppShowcase } from '../components/HomePage/AppShowcase';
import Footer from '../components/HomePage/Footer';
import { GridBeams } from '../components/UI/Background/Grid-Beams';
import { WhyPageBuilderSection } from '../components/HomePage/WhyPageBuilder';
import { ExportOptionsSection } from '../components/HomePage/ExportOptionSection';
import { CTASection } from '../components/HomePage/CtaSection';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <GridBeams>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HeroSection />
          <section
            className="relative rounded-t-3xl border border-border/60 backdrop-blur overflow-hidden
        bg-[linear-gradient(to_bottom_right,_color-mix(in_oklab,var(--background),_transparent_30%),_color-mix(in_oklab,var(--background),_transparent_10%))]
        after:bg-[radial-gradient(1200px_600px_at_50%_40%,_transparent_35%,_rgba(0,0,0,0.08)_85%)]
        after:opacity-60
        before:content-[''] before:absolute before:-inset-[35%] before:pointer-events-none before:blur-[70px]
        before:opacity-55
        before:bg-[radial-gradient(700px_360px_at_20%_15%,_color-mix(in_oklab,var(--primary),_transparent),_transparent),radial-gradient(700px_360px_at_80%_20%,_color-mix(in_oklab,var(--primary),_transparent),_transparent),radial-gradient(520px_260px_at_50%_110%,_color-mix(in_oklab,var(--primary),_transparent),_transparent)]
      "
          >
            <AppShowcase />

            {/* <HomepageFeatures /> */}
            <WhyPageBuilderSection />
            <ExportOptionsSection />
            <CTASection />
            <Footer />
          </section>
        </div>
      </GridBeams>
    </Layout>
  );
}
