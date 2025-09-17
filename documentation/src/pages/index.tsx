import React from 'react';
import clsx from 'clsx';
// import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomePage/HomepageFeatures';

import styles from './index.module.css';
import '../css/custom.css';
import { HeroSection } from '../components/HomePage/HeroSection';
import { AppShowcase } from '../components/HomePage/AppShowcase';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title ">{siteConfig.title}</h1>
        <p className="hero__subtitle ">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HeroSection />
      <AppShowcase />

      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
