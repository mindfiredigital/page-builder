import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Drag & Drop Components',
    description: (
      <>
        Effortlessly add, move, and arrange elements with a smooth drag-and-drop interface, making page building intuitive and efficient.
      </>
    ),
  },
  {
    title: 'Customize Components',
    description: (
      <>
        Fine-tune every component by modifying styles, content, and behavior, ensuring a fully personalized design experience.
      </>
    ),
  },
  {
    title: 'Undo & Redo Actions',
    description: (
      <>
        Instantly revert unwanted changes or restore previous edits with seamless undo and redo functionality.
      </>
    ),
  },
];

function Feature({ title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}