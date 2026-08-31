import React, { forwardRef, Ref } from 'react';
import { useInvestorDeckStore, DEFAULTS } from '../store/InvestorDeckStore';

interface InvestorDeckProps {
  componentId?: string;
}

const InvestorDeck = forwardRef(
  (props: InvestorDeckProps, ref: Ref<HTMLDivElement>) => {
    const id = (props as any).componentId || 'default';
    const s = useInvestorDeckStore(state => state.settings[id] ?? DEFAULTS);

    const primary = s.primaryColor;
    const secondary = s.secondaryColor;

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          color: '#1a1a2e',
          background: '#fff',
          width: '100%',
        }}
      >
        <style>{`
        .id-section { padding: 48px 64px; }
        .id-section + .id-section { border-top: 1px solid #e5e7eb; }
        .id-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px; background: #fff; }
        .id-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .id-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 768px) {
          .id-grid-2, .id-grid-3 { grid-template-columns: 1fr; }
          .id-section { padding: 32px 24px; }
        }
        .id-stat-box {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;
        }
        .id-stat-box:last-child { border-bottom: none; }
        .id-bullet {
          display: flex; align-items: flex-start; gap: 8px;
          margin-bottom: 10px; font-size: 14px; line-height: 1.6; color: #374151;
        }
        .id-bullet::before { content: '•'; color: #9ca3af; flex-shrink: 0; margin-top: 1px; }
        .id-tier-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 15px; }
        .id-full-img { width: 100%; border-radius: 8px; display: block; }
      `}</style>

        {/* ── Cover / Hero ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${primary}12 0%, #fff 60%, ${secondary}10 100%)`,
            padding: '64px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div style={{ maxWidth: 800 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {s.companyName.slice(0, 1)}
              </div>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#111827' }}>
                {s.companyName}
              </span>
              <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 4 }}>
                {s.industry}
              </span>
            </div>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 800,
                margin: '0 0 16px',
                lineHeight: 1.2,
                color: '#111827',
              }}
            >
              Investor Presentation
            </h1>
            <p
              style={{
                fontSize: 16,
                color: '#4b5563',
                maxWidth: 600,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {s.tagline}
            </p>
          </div>
        </div>

        {/* ── Problem ── */}
        {s.showProblem && (
          <div className="id-section">
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 8,
              }}
            >
              A Legacy Industry Awaiting Innovative Change
            </h2>
            <div
              className="id-card"
              style={{ marginBottom: 24, background: '#fafafa' }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  margin: 0,
                }}
              >
                The insurance industry's reliance on antiquated legacy systems
                has created a landscape plagued by inefficiencies, errors from
                bad data, and inflexibility — demanding a transformative leap
                towards consumer-centric technologies.
              </p>
            </div>
            <div className="id-grid-2">
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 14,
                  }}
                >
                  Legacy Insurance Workflows
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                  Outdated, manual, and paper-based processes traditionally used
                  in the insurance industry.
                </p>
                {[
                  'Tedious and time-consuming tasks',
                  'High dependency on physical paperwork',
                  'Limited automation and digitalization',
                  'Inefficient data management',
                ].map(t => (
                  <div key={t} className="id-bullet">
                    {t}
                  </div>
                ))}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 14,
                  }}
                >
                  Effects on Businesses
                </h3>
                {[
                  'Slower response times and customer service',
                  'Increased operational costs',
                  'Reduced competitiveness in a digital world',
                  'Difficulty in adapting to changing regulations',
                ].map(t => (
                  <div key={t} className="id-bullet">
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="id-card"
              style={{
                marginTop: 20,
                textAlign: 'center',
                background: '#fafafa',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Available digital solutions are incredibly expensive and take
                years to become fully implemented due to complexity.
              </p>
            </div>
          </div>
        )}

        {/* ── Solution ── */}
        {s.showSolution && (
          <div className="id-section" style={{ background: '#fafafa' }}>
            <div
              className="id-card"
              style={{
                marginBottom: 24,
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                background: '#fff',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {s.companyName.slice(0, 1)}
              </div>
              <div>
                <p
                  style={{
                    margin: '0 0 6px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  A core insurance digital platform — a direct replacement for
                  legacy systems used by Tier 2 &amp; 3 carriers, MGAs, mutuals,
                  and brokers.
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#4b5563' }}>
                  Built on a 9-module framework adaptable to the evolving needs
                  of all stakeholders in the value chain.
                </p>
              </div>
            </div>

            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 8,
              }}
            >
              Replacing Archaic Workflows with a Digital Tool
            </h2>
            <div
              className="id-card"
              style={{ marginBottom: 24, background: '#fff' }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {s.companyName} empowers insurers and brokers with software that
                automates critical and time-consuming operations.
              </p>
            </div>

            <div className="id-grid-2" style={{ marginBottom: 24 }}>
              <div
                className="id-card"
                style={{ background: '#fff', padding: 16 }}
              >
                <img
                  src={s.imgSolutionDiagram}
                  alt="Value chain diagram"
                  className="id-full-img"
                />
              </div>
              <div
                className="id-card"
                style={{
                  background: '#fff',
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={s.imgSoftwareFramework}
                  alt="Software framework"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 280,
                    borderRadius: 8,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
            </div>

            <div className="id-grid-2">
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 14,
                  }}
                >
                  Why now?
                </h3>
                <div style={{ marginBottom: 14 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      margin: '0 0 4px',
                    }}
                  >
                    Cost:
                  </p>
                  <div className="id-bullet">
                    Firms with $200M in GWP have a hard time affording other
                    well-known software solutions — {s.companyName} is a
                    fraction of the cost.
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      margin: '0 0 4px',
                    }}
                  >
                    Automation appetite:
                  </p>
                  <div className="id-bullet">
                    Clients can grow significantly by leveraging technology to
                    streamline operations. Workflow duration shortened by
                    80–90%.
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      margin: '0 0 4px',
                    }}
                  >
                    Clear advantages:
                  </p>
                  <div className="id-bullet">
                    Small firms can assist clients at a level unachievable with
                    legacy systems.
                  </div>
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 14,
                  }}
                >
                  Insurance Manufacturers experience…
                </h3>
                {[
                  '$100M+ for alternative core insurance platforms.',
                  '80% of budget spent on legacy system maintenance.',
                  '6–9 months to get a new insurance product to market.',
                  'Inability to be responsive in an ever-changing market.',
                ].map(t => (
                  <div key={t} className="id-bullet">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Market ── */}
        {s.showMarket && (
          <div className="id-section">
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 24,
              }}
            >
              Immediate Target Market — North America
            </h2>
            <div className="id-grid-2">
              <div>
                <p style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>
                  Insurance Brokers, BwP, MGAs, and Mutuals fit into tiers based
                  on their Gross Written Premium (GWP):
                </p>
                <div className="id-tier-row">
                  <span style={{ fontWeight: 700, color: secondary }}>
                    Tier 1
                  </span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    &gt;$500 million
                  </span>
                </div>
                <div className="id-tier-row">
                  <span style={{ fontWeight: 700, color: secondary }}>
                    Tier 2
                  </span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    $100 million to $500 million
                  </span>
                </div>
                <div className="id-tier-row">
                  <span style={{ fontWeight: 700, color: secondary }}>
                    Tier 3
                  </span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    $0 to $100 million
                  </span>
                </div>
                <div
                  className="id-card"
                  style={{ marginTop: 16, background: '#fafafa' }}
                >
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    {s.companyName} is a software-led company within the
                    Insurtech innovation ecosystem.
                  </p>
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontSize: 12,
                      color: '#374151',
                    }}
                  >
                    The most important performance metric to evaluate is the
                    market GWP.
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>
                    {s.companyName}'s business model enables insurance
                    manufacturers to generate more GWP through automation, then
                    takes a % as recurring revenue.
                  </p>
                </div>
              </div>
              <div>
                <div className="id-card" style={{ marginBottom: 16 }}>
                  <div className="id-stat-box">
                    <span>Total GWP in 2023</span>
                    <strong>$950 billion</strong>
                  </div>
                  <div className="id-stat-box">
                    <span>Tier 2 and 3 GWP in 2023</span>
                    <strong>$294 billion</strong>
                  </div>
                  <div className="id-stat-box">
                    <span>Tier 2 and 3 P&amp;C Companies</span>
                    <strong>4,133</strong>
                  </div>
                  <div className="id-stat-box">
                    <span>Revenue potential — 1% recurring fee on GWP</span>
                    <strong style={{ color: primary }}>~$3 billion</strong>
                  </div>
                </div>
                <div className="id-card" style={{ borderColor: secondary }}>
                  <div className="id-stat-box">
                    <span style={{ color: secondary }}>Revenue target</span>
                    <strong style={{ color: secondary }}>$100 million</strong>
                  </div>
                  <div className="id-stat-box">
                    <span style={{ color: secondary }}>
                      Equivalent market share
                    </span>
                    <strong style={{ color: secondary }}>3.4%</strong>
                  </div>
                  <div className="id-stat-box">
                    <span style={{ color: secondary }}>
                      # of clients (simple avg GWP/client)
                    </span>
                    <strong style={{ color: secondary }}>141</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Growth Strategy ── */}
        {s.showGrowth && (
          <div className="id-section" style={{ background: '#fafafa' }}>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 24,
              }}
            >
              Growth Strategy
            </h2>
            <div
              className="id-card"
              style={{ marginBottom: 24, background: '#fff' }}
            >
              <h3
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: secondary,
                  marginBottom: 20,
                }}
              >
                Revenue Streams
              </h3>
              <div className="id-grid-2">
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    Recurring Transaction Fee
                  </p>
                  <p
                    style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}
                  >
                    Represents 1% of GWP
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    Payment Processor
                  </p>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>
                    Enabling end-consumer insurance payments to flow through to
                    the insurer
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    Upfront Onboarding
                  </p>
                  <p
                    style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}
                  >
                    The purchase price of the software ($0.2 – $1.5 million)
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    Consulting
                  </p>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>
                    Generate custom performance reports and supporting data
                    analytics
                  </p>
                </div>
              </div>
            </div>
            <div
              className="id-card"
              style={{ background: '#fff', padding: 16 }}
            >
              <img
                src={s.imgCharts}
                alt="ARR and Gross Margin charts"
                className="id-full-img"
              />
            </div>
            <div
              className="id-card"
              style={{ marginTop: 16, textAlign: 'center', background: '#fff' }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {s.companyName} will be the catalyst for revenue and customer
                growth.
              </p>
            </div>
          </div>
        )}

        {/* ── Clients ── */}
        {s.showClients && (
          <div className="id-section">
            <div
              className="id-card"
              style={{ marginBottom: 24, background: '#fafafa' }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Customers have replaced incumbent technology solutions with{' '}
                {s.companyName}'s software.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: '#4b5563',
                  fontStyle: 'italic',
                }}
              >
                "This platform is way more affordable than its competitors. It
                is so powerful that a Customer Service Representative can easily
                touch 100 commercial files a day."
              </p>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Sr Broker, Ives Insurance
              </p>
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 12,
              }}
            >
              Active Clients and Market Traction
            </h2>
            <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
              {s.companyName}'s core customers are{' '}
              <strong>
                Tier 2 and Tier 3 Brokers, MGAs, Mutuals, and Brokers with
                Programs
              </strong>
            </p>
            <div className="id-card" style={{ padding: 16, marginBottom: 16 }}>
              <img
                src={s.imgClients}
                alt="Active clients — Bnude and Cnude"
                className="id-full-img"
              />
            </div>
            <div className="id-grid-2">
              <div className="id-card">
                <div className="id-stat-box">
                  <span style={{ fontWeight: 600 }}>Bnude 2023</span>
                  <strong>$400k ARR</strong>
                </div>
                <div className="id-stat-box">
                  <span style={{ fontWeight: 600 }}>Bnude 2024</span>
                  <strong>$500k ARR</strong>
                </div>
              </div>
              <div className="id-card">
                <div className="id-stat-box">
                  <span style={{ fontWeight: 600 }}>Cnude 2023</span>
                  <strong>$102k ARR</strong>
                </div>
                <div className="id-stat-box">
                  <span style={{ fontWeight: 600 }}>Cnude 2024</span>
                  <strong>$1 million ARR</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Competitors ── */}
        {s.showCompetitors && (
          <div className="id-section" style={{ background: '#fafafa' }}>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 24,
              }}
            >
              Competitors
            </h2>
            <div className="id-grid-2" style={{ marginBottom: 32 }}>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 16,
                  }}
                >
                  {s.companyName}
                </h3>
                {[
                  'Is far cheaper than other digital systems.',
                  'Can onboard a client in 3–9 months.',
                  'Has a proprietary tech stack that is easy to customize and improve through modular construction.',
                  'Can navigate industry nuances effectively with digital service.',
                  'Can leverage industry relationships and strategic partnerships.',
                ].map(t => (
                  <div key={t} className="id-bullet">
                    {t}
                  </div>
                ))}
              </div>
              <div
                className="id-card"
                style={{
                  background: '#fff',
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={s.imgCompetitors}
                  alt="Direct and Indirect Competitors"
                  className="id-full-img"
                />
              </div>
            </div>

            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#374151',
                marginBottom: 16,
              }}
            >
              Past Comparable Acquisitions
            </h3>
            <div className="id-grid-3">
              <div className="id-card" style={{ background: '#fff' }}>
                <img
                  src={s.imgAcquisition1}
                  alt="A Brick-and-Mortar Brokerage"
                  style={{ width: '100%', borderRadius: 6, marginBottom: 12 }}
                />
                {[
                  '7 Locations',
                  '$24 million',
                  'Acquired by Canada Broker Link/Intact',
                ].map(f => (
                  <p
                    key={f}
                    style={{ fontSize: 12, color: '#6b7280', margin: '2px 0' }}
                  >
                    • {f}
                  </p>
                ))}
              </div>
              <div className="id-card" style={{ background: '#fff' }}>
                <img
                  src={s.imgAcquisition2}
                  alt="nuera insurance"
                  style={{ width: '100%', borderRadius: 6, marginBottom: 12 }}
                />
                {[
                  'Digital brokerage',
                  '$9.5 million',
                  'Acquired by Westland Insurance',
                ].map(f => (
                  <p
                    key={f}
                    style={{ fontSize: 12, color: '#6b7280', margin: '2px 0' }}
                  >
                    • {f}
                  </p>
                ))}
              </div>
              <div className="id-card" style={{ background: '#fff' }}>
                <img
                  src={s.imgAcquisition3}
                  alt="exhale insurance"
                  style={{ width: '100%', borderRadius: 6, marginBottom: 12 }}
                />
                {[
                  'Digital MGA',
                  '$9.5 million',
                  'Acquired by Westland Insurance',
                ].map(f => (
                  <p
                    key={f}
                    style={{ fontSize: 12, color: '#6b7280', margin: '2px 0' }}
                  >
                    • {f}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Team ── */}
        {s.showTeam && (
          <div className="id-section">
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 24,
              }}
            >
              Team
            </h2>
            <div className="id-card" style={{ padding: 16, marginBottom: 24 }}>
              <img src={s.imgTeam} alt="Team" className="id-full-img" />
            </div>
            <div
              className="id-card"
              style={{
                background: `linear-gradient(135deg, ${secondary}15, ${primary}15)`,
                border: `1.5px solid ${primary}40`,
                textAlign: 'center',
                padding: '32px 24px',
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: secondary,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                The {s.companyName} team has 3 successful insurance venture
                exits,
                <br />
                totalling proceeds of $43 million.
              </p>
            </div>
          </div>
        )}

        {/* ── Capital Raise ── */}
        {s.showCapitalRaise && (
          <div className="id-section" style={{ background: '#fafafa' }}>
            <div style={{ marginBottom: 32 }}>
              <img
                src={s.imgCapitalRaise}
                alt="Business context"
                className="id-full-img"
                style={{ borderRadius: 10 }}
              />
            </div>
            <div
              className="id-card"
              style={{
                marginBottom: 24,
                textAlign: 'center',
                background: '#fff',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {s.companyName} will be the catalyst for revenue and customer
                growth.
              </p>
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 24,
              }}
            >
              Capital Raise and Use of Proceeds
            </h2>
            <div
              className="id-card"
              style={{
                marginBottom: 24,
                borderColor: secondary,
                background: `linear-gradient(135deg, ${secondary}08, #fff)`,
              }}
            >
              <div className="id-grid-2">
                <div>
                  <p
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: secondary,
                      margin: '0 0 12px',
                    }}
                  >
                    Ask
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: secondary,
                      margin: '0 0 4px',
                    }}
                  >
                    Human Capital
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: secondary,
                      margin: 0,
                    }}
                  >
                    {s.companyName.split(' ')[0]} Refinement
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: secondary,
                      margin: '0 0 12px',
                    }}
                  >
                    {s.askAmount}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: secondary,
                      margin: '0 0 4px',
                    }}
                  >
                    {s.humanCapital}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: secondary,
                      margin: 0,
                    }}
                  >
                    {s.productRefinement}
                  </p>
                </div>
              </div>
            </div>
            <div className="id-grid-2">
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 12,
                  }}
                >
                  {s.companyName.split(' ')[0]} Refinement
                </h3>
                <div className="id-bullet">
                  This is not required for clients today, but rather is dry
                  powder acknowledging there will be opportunities for ongoing
                  improvement and iterations of the software.
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: secondary,
                    marginBottom: 12,
                  }}
                >
                  Human Capital
                </h3>
                <div className="id-bullet">
                  Capital to fundamentally grow the team from 35 employees to 55
                  employees, enabling {s.companyName} to increase the number of
                  clients they can onboard concurrently, instrumentally
                  assisting in converting the sales pipeline to ARR.
                </div>
              </div>
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: secondary,
                marginTop: 24,
                marginBottom: 12,
              }}
            >
              Liquidity &amp; Implied Runway
            </h3>
            <div className="id-bullet">
              The capital raise not only ensures {s.companyName} reaches
              profitability in an overly-conservative scenario, but also
              empowers {s.companyName} to realize the full potential of elevated
              growth aspirations, positioning the Company for sustained success
              and market leadership.
            </div>
          </div>
        )}

        {/* ── Video ── */}
        {s.showVideo && s.videoSrc && (
          <div className="id-section">
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: primary,
                marginBottom: 8,
              }}
            >
              Watch Our Story
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
              See how {s.companyName} is transforming the insurance industry.
            </p>
            <div
              className="id-card"
              style={{ padding: 0, overflow: 'hidden', background: '#000' }}
            >
              <video
                src={s.videoSrc}
                autoPlay={s.videoAutoplay}
                muted={s.videoMuted}
                loop={s.videoLoop}
                controls={s.videoControls}
                style={{
                  width: '100%',
                  display: 'block',
                  maxHeight: 520,
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          style={{
            padding: '24px 64px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {s.companyName.slice(0, 1)}
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
              {s.companyName}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
            Confidential Investor Presentation
          </p>
        </div>
      </div>
    );
  }
);

InvestorDeck.displayName = 'InvestorDeck';

export default InvestorDeck;
