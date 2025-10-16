import React, { useState, forwardRef, Ref, useEffect } from 'react';

// --- Type Definitions ---

// Props type for the SVG icons
interface IconProps {
    className?: string;
    color?: string;
    [key: string]: any;
    onClick?: (event: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => void;
}

// Props type for the general SVG wrapper
interface SVGWrapperProps extends IconProps {
    children: React.ReactNode;
}

// Type for a functional component that accepts IconProps
type FeatureIcon = React.FC<IconProps>;

// Interface for feature data array
interface FeatureData {
    icon: FeatureIcon;
    title: string;
    description: string;
}

// --- CSS Styles (Embedded for single file mandate) ---
const GlobalStyles = () => (
    <style>
        {`
        /* Load Inter Font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        /* CSS Reset / Base */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .lp-body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            min-width: 100%;
            background-color: #f7f7f7;
            background-image: linear-gradient(to bottom right, #F3E5F5, #FFFFFF 50%, #E3F2FD);
            color: #212121;
        }

        /* Container and Layout */
        .lp-container {
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 16px;
            padding-right: 16px;
        }

        /* Hero Title Gradient */
        .lp-gradient-text {
            background: linear-gradient(to right, #9C27B0, #2196F3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
        }

        /* Responsive Typography (Replacing MUI Typography) */
        .lp-h1 { font-size: 2.5rem; line-height: 1.1; font-weight: 800; }
        .lp-h5 { font-size: 1.25rem; line-height: 1.5; }
        .lp-h4 { font-size: 2rem; line-height: 1.2; font-weight: 700; }
        .lp-h3 { font-size: 3rem; line-height: 1.2; font-weight: 800; }
        .lp-subtitle-1 { font-size: 1.125rem; font-weight: 600; }
        .lp-body-1 { font-size: 1rem; }
        .lp-body-2 { font-size: 0.875rem; }

        @media (min-width: 960px) {
            .lp-h1 { font-size: 4rem; }
            .lp-h3 { font-size: 3.5rem; }
        }

        /* Button Styling (Replacing MUI Button) */
        .lp-button {
            border: none;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-transform: none;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
            border-radius: 8px;
            padding: 12px 32px;
            min-width: 180px;
            font-size: 1rem;
        }

        .lp-gradient-button {
            background: linear-gradient(45deg, #9C27B0 30%, #2196F3 90%);
            color: white !important;
            box-shadow: 0 3px 5px 2px rgba(156, 39, 176, .3) !important;
        }
        .lp-gradient-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 10px 3px rgba(156, 39, 176, .5) !important;
            background: linear-gradient(45deg, #7B1FA2 30%, #1976D2 90%) !important;
        }
        .lp-outlined-button {
            background-color: transparent;
            color: #9C27B0;
            border: 2px solid #9C27B0;
        }
        .lp-cta-button {
            padding: 16px 64px !important;
            font-size: 1.125rem !important;
        }
        .lp-nav-button {
            padding: 8px 16px;
            min-width: unset;
        }

        /* Nav Bar Blur Effect (Replacing MUI AppBar) */
        .lp-navbar {
            position: sticky;
            top: 0;
            z-index: 1000;
            background-color: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* Hero Subtitle */
        .lp-subtitle {
            color: #616161; /* grey 700 */
            max-width: 800px;
            margin: 0 auto 40px auto;
        }

        /* Features Section Layout (Replacing MUI Grid) */
        .lp-features-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            justify-content: center;
        }
        .lp-grid-item {
            width: 100%; /* Default mobile width */
        }
        @media (min-width: 600px) {
            .lp-grid-item {
                width: calc(50% - 12px); /* sm:6 (2 columns) */
            }
        }
        @media (min-width: 1200px) {
            .lp-grid-item {
                width: calc(25% - 18px); /* lg:3 (4 columns) */
            }
        }

        /* Feature Card Styles (Replacing MUI Paper) */
        .lp-features-section {
            padding: 80px 0;
            background-color: white;
        }
        .lp-feature-paper {
            padding: 24px;
            border-radius: 8px;
            height: 100%;
            background: linear-gradient(to bottom right, #F3E5F5, #E3F2FD);
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .lp-feature-paper:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }
        .lp-feature-icon-box {
            width: 48px;
            height: 48px;
            background: linear-gradient(to bottom right, #9C27B0, #2196F3);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-bottom: 16px;
            font-size: 28px;
        }

        /* Stats Section */
        .lp-stats-section {
            padding: 80px 0;
            background: linear-gradient(45deg, #9C27B0 30%, #2196F3 90%);
            color: white;
            text-align: center;
        }
        .lp-stats-grid {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }
        @media (min-width: 600px) {
            .lp-stats-grid {
                flex-direction: row;
                justify-content: space-around;
            }
        }
        .lp-stat-subtitle {
            color: #E1BEE7; /* light purple */
        }

        /* Footer */
        .lp-footer {
            background-color: #212121; /* grey 900 */
            color: #bdbdbd; /* grey 400 */
            padding-top: 48px;
            padding-bottom: 48px;
        }
        .lp-footer-divider {
            border-top: 1px solid #424242;
            margin-top: 32px;
            padding-top: 32px;
            text-align: center;
        }
        .lp-footer a {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s;
        }
        .lp-footer a:hover {
            color: white;
        }
        .lp-footer-links-container {
            display: flex;
            flex-wrap: wrap;
            gap: 32px;
            justify-content: space-between;
        }
        @media (min-width: 600px) {
             .lp-footer-links-container > div {
                 width: auto;
             }
        }

        /* Decorative Pulse Animation */
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.1; }
        }
        .lp-pulse-1 {
            animation: pulse 4s infinite ease-in-out;
        }
        .lp-pulse-2 {
            animation: pulse 4s infinite ease-in-out 1s;
        }

        /* Mobile Drawer (Replacing MUI Drawer) */
        .lp-drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1050;
            transition: opacity 0.3s;
            opacity: 0;
            pointer-events: none;
        }

        .lp-drawer-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }

        .lp-drawer-content {
            position: fixed;
            top: 0;
            right: 0;
            width: 250px;
            height: 100%;
            background-color: white;
            z-index: 1060;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            padding-top: 16px;
        }

        .lp-drawer-content.open {
            transform: translateX(0);
        }

        .lp-drawer-list {
            list-style: none;
            padding: 0;
            padding-top: 64px;
            text-align: center;
        }

        .lp-drawer-list li {
            padding: 12px 0;
        }

        .lp-drawer-list a {
            text-decoration: none;
            color: #212121;
            font-size: 1rem;
            display: block;
        }
        `}
    </style>
);
// --- End CSS Styles ---


// Base wrapper to ensure SVGs inherit sizing from the parent component
const SVGWrapper: React.FC<SVGWrapperProps> = ({ children, className, color, onClick, ...rest }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color || 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        {...rest}
    >
        {children}
    </svg>
);

const MenuSVG: FeatureIcon = (props) => (
    <SVGWrapper {...props}>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </SVGWrapper>
);

const CloseSVG: FeatureIcon = (props) => (
    <SVGWrapper {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </SVGWrapper>
);

const StarSVG: FeatureIcon = (props) => (
    <SVGWrapper {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </SVGWrapper>
);

const CheckCircleSVG: FeatureIcon = (props) => (
    <SVGWrapper {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </SVGWrapper>
);

const UsersSVG: FeatureIcon = (props) => (
    <SVGWrapper {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <path d="M20 10v9"></path>
        <path d="M23 16l-3 3-3-3"></path>
    </SVGWrapper>
);

const ZapSVG: FeatureIcon = (props) => (
    <SVGWrapper {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </SVGWrapper>
);

// Feature data array
const featuresData: FeatureData[] = [
    { icon: ZapSVG, title: 'Lightning Fast', description: 'Optimized performance for instant loading' },
    { icon: UsersSVG, title: 'Collaborative', description: 'Work together with your team in real-time' },
    { icon: CheckCircleSVG, title: 'Easy to Use', description: 'Intuitive interface anyone can master' },
    { icon: StarSVG, title: 'Premium Quality', description: 'Professional results every time' }
];

// Prop type for GradientButton children
interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => void;
    href?: string;
}

// Custom button component to handle gradient styling
const GradientButton: React.FC<ButtonProps> = ({ children, className, href, ...rest }) => {
    // Determine if it should be an anchor tag or a button for accessibility/navigation
    if (href) {
        return (
            <a
                href={href}
                className={`lp-button lp-gradient-button ${className || ''}`}
                role="button"
                {...rest}
            >
                {children}
            </a>
        );
    }
    return (
        <button
            type="button"
            className={`lp-button lp-gradient-button ${className || ''}`}
            {...rest}
        >
            {children}
        </button>
    );
};

// Logo component (used in Nav and Footer)
const NavLogo: React.FC = () => (
    <div
        style={{
            width: 40, height: 40,
            background: 'linear-gradient(to bottom right, #9C27B0, #2196F3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
            PB
        </span>
    </div>
);

interface AppProps { }

// The main application component
const App: React.FC<AppProps> = forwardRef((props: AppProps, forwardedRef: Ref<HTMLDivElement>) => {
    // State to track mobile view (based on 960px breakpoint)
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const heroTitle = 'Build Amazing Web Experiences';
    const heroSubtitle = 'Create stunning, responsive pages with our drag-and-drop builder';
    const ctaText = 'Get Started Free';

    // Effect to handle window resize for responsiveness
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 960);
        };
        checkMobile(); // Initial check

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Toggle function for the mobile navigation drawer
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent): void => {
        // Ignore key events that might interfere with closing (e.g., tab, shift)
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setIsMobileMenuOpen(open);
    };

    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    // Mobile Menu Component (replaces MUI Drawer)
    const MobileMenu: React.FC = () => (
        <>
            {/* Overlay */}
            <div
                className={`lp-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={toggleDrawer(false) as any}
            ></div>
            {/* Drawer Content */}
            <div
                className={`lp-drawer-content ${isMobileMenuOpen ? 'open' : ''}`}
                role="presentation"
            >
                <button
                    onClick={toggleDrawer(false) as any}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#212121',
                        padding: 8,
                    }}
                    aria-label="Close menu"
                >
                    <CloseSVG style={{ width: 24, height: 24 }} />
                </button>
                <ul className="lp-drawer-list">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a href={item.href} onClick={toggleDrawer(false) as any}>
                                {item.name}
                            </a>
                        </li>
                    ))}
                    <li style={{ marginTop: 16 }}>
                        <button
                            type="button"
                            className="lp-button lp-outlined-button lp-nav-button"
                            style={{ minWidth: 150 }}
                            onClick={toggleDrawer(false) as any}
                        >
                            Sign In
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );


    // --- Main Render ---
    return (
        <div ref={forwardedRef} className="lp-body">
            <GlobalStyles />

            {/* Navigation Header (Replaces MUI AppBar/Toolbar) */}
            <header className="lp-navbar">
                <div className="lp-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
                    <NavLogo />

                    {isMobile ? (
                        <button
                            onClick={toggleDrawer(true) as any}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#212121',
                                padding: 8,
                            }}
                            aria-label="Open menu"
                        >
                            <MenuSVG style={{ width: 24, height: 24 }} />
                        </button>
                    ) : (
                        <nav style={{ display: 'flex', alignItems: 'center' }}>
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#757575',
                                        margin: '0 8px',
                                        padding: '8px 12px',
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button
                                type="button"
                                className="lp-button lp-nav-button"
                                style={{
                                    marginLeft: 32,
                                    backgroundColor: '#9C27B0',
                                    color: 'white',
                                    boxShadow: 'none',
                                    minWidth: 100,
                                }}
                            >
                                Sign In
                            </button>
                        </nav>
                    )}
                </div>
            </header>
            {isMobile && <MobileMenu />}


            {/* Hero Section */}
            <section style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '80px 0' : '120px 0', textAlign: 'center' }}>
                <div className="lp-container">

                    {/* Hero Title (Replaces MUI Typography h1) */}
                    <h1
                        className="lp-h1 lp-gradient-text"
                        style={{ marginBottom: 24 }}
                    >
                        {heroTitle}
                    </h1>

                    {/* Hero Subtitle (Replaces MUI Typography h5) */}
                    <p className="lp-h5 lp-subtitle">
                        {heroSubtitle}
                    </p>

                    {/* CTA Buttons (Replacing MUI Box for layout) */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, justifyContent: 'center' }}>
                        <GradientButton href="#" className="lp-cta-button">
                            {ctaText}
                        </GradientButton>
                        <a
                            href="#"
                            className="lp-button lp-outlined-button"
                            style={{
                                fontWeight: 600,
                                textDecoration: 'none',
                                padding: '12px 32px',
                            }}
                        >
                            Watch Demo
                        </a>
                    </div>

                    {/* Decorative Elements (Replacing MUI Box) */}
                    <div
                        style={{
                            position: 'absolute', top: 80, left: 40, width: 200, height: 200,
                            backgroundColor: '#CE93D8',
                            borderRadius: '50%', opacity: 0.1,
                            filter: 'blur(50px)', zIndex: -1,
                        }}
                        className="lp-pulse-1"
                    />
                    <div
                        style={{
                            position: 'absolute', top: 160, right: 40, width: 200, height: 200,
                            backgroundColor: '#90CAF9',
                            borderRadius: '50%', opacity: 0.1,
                            filter: 'blur(50px)', zIndex: -1,
                        }}
                        className="lp-pulse-2"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="lp-features-section">
                <div className="lp-container">
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <h2 className="lp-h4" style={{ marginBottom: 12 }}>
                            Powerful Features
                        </h2>
                        <p className="lp-h5 lp-subtitle" style={{ color: '#616161' }}>
                            Everything you need to create amazing web experiences
                        </p>
                    </div>

                    {/* Feature Cards Grid (Replaces MUI Grid) */}
                    <div className="lp-features-grid">
                        {featuresData.map((feature: FeatureData, index: number) => (
                            <div className="lp-grid-item" key={index}>
                                <div
                                    className="lp-feature-paper" // Replaces MUI Paper
                                >
                                    <div
                                        className="lp-feature-icon-box"
                                    >
                                        <feature.icon stroke="white" />
                                    </div>
                                    <p className="lp-subtitle-1" style={{ marginBottom: 8 }}>
                                        {feature.title}
                                    </p>
                                    <p className="lp-body-1" style={{ color: '#616161' }}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section (Replaces MUI Box/Grid) */}
            <section
                className="lp-stats-section"
            >
                <div className="lp-container">
                    <div className="lp-stats-grid">
                        <div>
                            <p className="lp-h3" style={{ marginBottom: 8 }}>10K+</p>
                            <p className="lp-subtitle-1 lp-stat-subtitle">Active Users</p>
                        </div>
                        <div>
                            <p className="lp-h3" style={{ marginBottom: 8 }}>50K+</p>
                            <p className="lp-subtitle-1 lp-stat-subtitle">Pages Created</p>
                        </div>
                        <div>
                            <p className="lp-h3" style={{ marginBottom: 8 }}>99.9%</p>
                            <p className="lp-subtitle-1 lp-stat-subtitle">Uptime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
                <div className="lp-container" style={{ maxWidth: 800, textAlign: 'center' }}>
                    <h2 className="lp-h4" style={{ fontWeight: 700, marginBottom: 16 }}>
                        Ready to Get Started?
                    </h2>
                    <p className="lp-h5" style={{ color: '#616161', marginBottom: 32, fontSize: '1.25rem' }}>
                        Join thousands of users building amazing experiences
                    </p>
                    <GradientButton href="#" className="lp-cta-button">
                        Start Building Now
                    </GradientButton>
                </div>
            </section>

            {/* Footer (Replaces MUI Box/Grid) */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer-links-container">
                        {/* Column 1: Logo & Tagline */}
                        <div style={{ flex: '1 1 100%', maxWidth: '300px' }}>
                            <NavLogo />
                            <p className="lp-body-2" style={{ marginTop: 16 }}>
                                Building the future of web experiences
                            </p>
                        </div>

                        {/* Link Columns */}
                        {[{ title: 'Product', links: ['Features', 'Pricing', 'Documentation'] },
                        { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                        { title: 'Legal', links: ['Privacy', 'Terms', 'Contact'] }].map((col) => (
                            <div key={col.title} style={{ flex: '1 1 150px' }}>
                                <p style={{ color: 'white', fontWeight: 'semibold', marginBottom: 16, fontSize: '1rem' }}>
                                    {col.title}
                                </p>
                                <ul style={{ listStyle: 'none' }}>
                                    {col.links.map((link) => (
                                        <li key={link} style={{ padding: '4px 0' }}>
                                            <a
                                                href="#"
                                                className="lp-body-2"
                                                style={{ color: 'inherit', textDecoration: 'none' }}
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="lp-footer-divider">
                        <p className="lp-body-2" style={{ color: '#9E9E9E' }}>
                            © 2025 Page Builder. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
});

App.displayName = 'App';

export default App;
