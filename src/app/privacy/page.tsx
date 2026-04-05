import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy — Multi AI Insight',
    description: 'Multi AI Insight Privacy Policy — how we handle your data.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-ink-950">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <a href="/" className="text-gold text-sm hover:underline mb-8 inline-block">← Back to Home</a>

                <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">Privacy Policy</h1>
                <p className="text-[var(--text-muted)] mb-12">Last updated: February 2026</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    {[
                        {
                            title: '1. Information We Collect',
                            content: `We collect only what we need to provide the service:
• Your email address and password (hashed with bcrypt, never stored in plain text)
• Company information you enter for analysis (name, product, description, domain, market)
• Generated intelligence reports
• Basic usage data (number of analyses run)

We do not collect payment information (no paid tier currently exists), browser fingerprints, or behavioral tracking data.`,
                        },
                        {
                            title: '2. How We Use Your Information',
                            content: `Your data is used exclusively to:
• Provide you with competitive intelligence reports
• Authenticate your account
• Store your analysis history so you can reference past reports

We do not sell, share, or rent your personal information to any third party. Your company data is never used to train AI models.`,
                        },
                        {
                            title: '3. Data Storage & Security',
                            content: `All data is stored in Supabase, which provides:
• SOC 2 Type II compliance
• 256-bit AES encryption at rest
• TLS encryption in transit
• Row-level security (RLS) on all database tables

Your JWT authentication tokens are signed with a secret key and expire automatically.`,
                        },
                        {
                            title: '4. AI Processing',
                            content: `When you run an analysis, your company description is sent to:
• Our web research AI agent (for real-time competitive research)
• Our strategic reasoning AI agent (for generating insights)

These requests are processed in-memory and are not stored by the AI providers. We use reputable, enterprise-grade AI infrastructure with data processing agreements in place.`,
                        },
                        {
                            title: '5. Cookies & Local Storage',
                            content: `We store your authentication token in localStorage to keep you signed in across sessions. We do not use third-party cookies or tracking pixels. We do not use Google Analytics or any external analytics service.`,
                        },
                        {
                            title: '6. Your Rights',
                            content: `You have the right to:
• Access all data we hold about you
• Delete your account and all associated data
• Export your analysis reports

To exercise these rights, email: mustakimnagori076@gmail.com`,
                        },
                        {
                            title: '7. Data Retention',
                            content: `We retain your account data until you request deletion. Analysis reports are retained to provide history functionality. You can request deletion of specific reports or your entire account at any time.`,
                        },
                        {
                            title: '8. GDPR Compliance',
                            content: `For users in the European Economic Area (EEA), you have additional rights under GDPR, including the right to data portability and the right to be forgotten. Our legal basis for processing is contractual necessity (to provide the service you signed up for).`,
                        },
                        {
                            title: '9. Contact',
                            content: `For privacy-related questions or requests:
Email: mustakimnagori076@gmail.com
LinkedIn: linkedin.com/in/mustakimnagori
Phone: +91 9313067765`,
                        },
                    ].map(section => (
                        <section key={section.title}>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{section.title}</h2>
                            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line text-sm">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
