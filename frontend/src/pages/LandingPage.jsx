import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyHireFlow from "../components/WhyHireFlow";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="features">
        <WhyHireFlow />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <section id="cta">
        <CTA />
      </section>

      <section id="about">
        <Footer />
      </section>
    </>
  );
}

export default LandingPage;
