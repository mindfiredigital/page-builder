import React from 'react';
import mindfireLogo from '../../../assets/images/logo.webp';

const CompanyLogo = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px',
      }}
    >
      <img src={mindfireLogo} width={200} height={90} />
    </div>
  );
};

const FinancialYeatText = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '16px',
      }}
    >
      <p style={{ fontSize: '14px' }}>For FY 25-26 effective from DOJ</p>
    </div>
  );
};

const SalaryStructureTable = () => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 16px auto',
    borderCollapse: 'collapse', // This is now properly typed
    border: '1px solid black',
  };

  const headerStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px 12px',
    backgroundColor: '#dbeafe',
    fontWeight: 'normal',
  };

  const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px 12px',
  };

  const centerCellStyle: React.CSSProperties = {
    ...cellStyle,
    textAlign: 'center', // This is now properly typed
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, textAlign: 'left' }}>
              Salary structure
            </th>
            <th style={{ ...headerStyle, textAlign: 'center' }}>Monthly</th>
            <th style={{ ...headerStyle, textAlign: 'center' }}>Annual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>Basic</td>
            <td style={centerCellStyle}>15100</td>
            <td style={centerCellStyle}>181200</td>
          </tr>
          <tr>
            <td style={cellStyle}>HRA</td>
            <td style={centerCellStyle}>3100</td>
            <td style={centerCellStyle}>37200</td>
          </tr>
          <tr>
            <td style={cellStyle}>Other Allowances</td>
            <td style={centerCellStyle}>1800</td>
            <td style={centerCellStyle}>21600</td>
          </tr>
          <tr>
            <td style={cellStyle}>Total Salary</td>
            <td style={centerCellStyle}>20000</td>
            <td style={centerCellStyle}>240000</td>
          </tr>
          <tr>
            <td style={cellStyle}>Deductions - tax (IT, PT etc)</td>
            <td style={centerCellStyle}>as applicable</td>
            <td style={centerCellStyle}>as applicable</td>
          </tr>
          <tr>
            <td style={cellStyle}>A: Total Salary</td>
            <td style={centerCellStyle}>20000</td>
            <td style={centerCellStyle}>240000 - Deductions</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const RetirementInsuranceTable = () => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 16px auto',
    borderCollapse: 'collapse', // Properly typed
    border: '1px solid black',
  };

  const headerStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    fontWeight: 'normal',
    textAlign: 'left', // Properly typed
  };

  const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px 12px',
  };

  const centerCellStyle: React.CSSProperties = {
    ...cellStyle,
    textAlign: 'center', // Properly typed
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle} colSpan={2}>
              Retiral / Insurance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>Group Self/Family Medical Insurance</td>
            <td style={centerCellStyle}>6500</td>
          </tr>
          <tr>
            <td style={cellStyle}>*LI & ADB = 30 + 20 Lakhs coverage</td>
            <td style={centerCellStyle}>4000</td>
          </tr>
          <tr>
            <td style={cellStyle}>Gratuity</td>
            <td style={centerCellStyle}>8712</td>
          </tr>
          <tr>
            <td style={cellStyle}>B: Total Retiral / Insurance</td>
            <td style={centerCellStyle}>19212</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const AnnualCTCDisplay = () => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 16px auto',
    borderCollapse: 'collapse', // Properly typed
    border: '1px solid black',
  };

  const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px 12px',
    fontWeight: 'bold',
  };

  const centerCellStyle: React.CSSProperties = {
    ...cellStyle,
    textAlign: 'center', // Properly typed
  };

  return (
    <div>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={cellStyle}>Annual CTC (A+B)</td>
            <td style={centerCellStyle}>259212</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const FooterNotes = () => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '16px auto 0 auto',
    fontSize: '12px',
  };

  const paragraphStyle: React.CSSProperties = {
    marginBottom: '8px',
  };

  return (
    <div style={containerStyle}>
      <p style={paragraphStyle}>
        *Gratuity is paid as per government regulations, which require 5
        continuous years of service for eligibility. The amount noted here is
        based on current Basic and gratuity formula.
      </p>
      <p>
        *LI – Life Insurance of 30 lakhs and ADB – Accidental Death Benefit of
        20 lakhs.
      </p>
    </div>
  );
};

const EmployeeName = () => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 16px auto',
  };

  const headingStyle: React.CSSProperties = {
    textAlign: 'center', // Properly typed
    fontSize: '20px',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Name</h2>
    </div>
  );
};

export {
  CompanyLogo,
  FinancialYeatText,
  SalaryStructureTable,
  RetirementInsuranceTable,
  AnnualCTCDisplay,
  FooterNotes,
  EmployeeName,
};
