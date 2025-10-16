import { PageBuilderReact, ComponentAttribute } from '@mindfiredigital/page-builder-react';
import ColorPicker from './components/ColorPicker';
import CustomRating from './components/CustomRating';
import CustomRatingSettings from './settings/CustomRatingSetting';
import Image from './components/Image';
import LandingPage from './components/LandingPage';
import { localExecuteFunction } from './utils/executeFormula';
import "./App.css";

const App = () => {
  const dynamicAttributes: ComponentAttribute[] = [
    // 1. Input Attribute A (Renders a 'number' input in the Attributes Tab)
    {
      id: 'input-a',
      type: 'Input',
      input_type: 'number',
      title: 'Input A',
      value: 10,
      key: 'input-a-key',
      execute_order: 1,
      editable: true,
      default_value: 10,
    },
    // 2. Input Attribute B
    {
      id: 'input-b',
      type: 'Input',
      input_type: 'number',
      title: 'Input B',
      value: 5,
      key: 'input-b-key',
      execute_order: 2,
      editable: true,
      default_value: 5,
    },
    // 3. Formula Attribute (SUM) - This is calculated by localExecuteFunction
    {
      id: 'formula-sum',
      type: 'Formula',
      title: 'Total Sum',
      value: '{Input A} + {Input B}', // The formula string (used for display/debug)
      key: 'formula-sum-key',
      execute_order: 3,
    },
    // 4. Formula Attribute (PRODUCT)
    {
      id: 'formula-product',
      type: 'Formula',
      title: 'Total Product',
      value: '{Input A} * {Input B}',
      key: 'formula-product-key',
      execute_order: 4,
    },
  ];

  const dynamicComponents = {
    Basic: [
      { name: 'button' },
      { name: 'header', attributes: dynamicAttributes, globalExecuteFunction: localExecuteFunction },
      { name: 'text', attributes: dynamicAttributes, globalExecuteFunction: localExecuteFunction },
      { name: 'table', attributes: dynamicAttributes, globalExecuteFunction: localExecuteFunction },
    ],
    Extra: [],
  };

  const customComponents = {
    ColorPicker: {
      component: ColorPicker,
      svg: `<svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z" fill="#000000"/>
      </svg>`,
      title: 'Color Picker Component',
    },
    CustomRating: {
      component: CustomRating,
      svg: `<svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z" fill="#000000"/>
      </svg>`,
      title: 'Custom Rating Component',
      settingsComponent: CustomRatingSettings,
    },
    Logo: {
      component: Image,
      svg: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 16L8 11L13 16L21 8" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 8H21V13" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      title: 'Image Component',
    },
    LandingPage: {
      component: LandingPage,
      svg: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H21V21H3V3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 9H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 21V9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      title: 'Landing Page',
    },
  };

  return (
    <div>
      <PageBuilderReact
        config={dynamicComponents}
        customComponents={customComponents}
      />
    </div>
  );
};

export default App;