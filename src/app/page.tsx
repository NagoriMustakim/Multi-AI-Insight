'use client'

import { Hero } from '@/components/landing/Hero'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { LiveFeedSection } from '@/components/landing/LiveFeedSection'
import { SampleReport } from '@/components/landing/SampleReport'
import { FAQSection } from '@/components/landing/FAQSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { TrustBar } from '@/components/landing/TrustBar'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeatureShowcase />
      <LiveFeedSection />
      <SampleReport />
      <FAQSection />
      <PricingSection />
      <TrustBar />
      <Footer />
    </main>
  )
}
