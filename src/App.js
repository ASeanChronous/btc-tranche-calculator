import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css'

const BTCTrancheCalculator = () => {
  const [btcPrice, setBtcPrice] = useState(117699);
  const [trancheSize, setTrancheSize] = useState(4000);
  const [customTrancheSize, setCustomTrancheSize] = useState('');
  const [totalTarget, setTotalTarget] = useState(60000);
  const [results, setResults] = useState(null);

  const TOTAL_DISCOUNT = 7.0;
  const NET_BUYER_DISCOUNT = 3.5;
  const SELLER_MARGIN = 2.0;
  const CONSULTANT_FEE = 1.5;

  const calculateTranche = () => {
    const size = customTrancheSize ? parseFloat(customTrancheSize) : trancheSize;
    
    if (!size || size <= 0 || !btcPrice || btcPrice <= 0) return;

    const marketValue = size * btcPrice;
    const priceAfterDiscount = btcPrice * (1 - NET_BUYER_DISCOUNT / 100);
    const atlantisPays = size * priceAfterDiscount;
    const consultantCommission = size * btcPrice * (CONSULTANT_FEE / 100);
    const sellerGrossRevenue = size * btcPrice;
    const sellerNetPayout = sellerGrossRevenue - consultantCommission;
    const atlantisSavings = marketValue - atlantisPays;
    const transactionsNeeded = Math.ceil(totalTarget / size);
    const totalContractValue = totalTarget * btcPrice;
    const totalAtlantisPays = totalTarget * priceAfterDiscount;
    const totalConsultantFees = totalTarget * btcPrice * (CONSULTANT_FEE / 100);
    const totalSellerPayout = totalTarget * btcPrice - totalConsultantFees;
    const totalAtlantisSavings = totalContractValue - totalAtlantisPays;

    setResults({
      size,
      marketValue,
      atlantisPays,
      sellerNetPayout,
      consultantCommission,
      atlantisSavings,
      pricePerBTC: priceAfterDiscount,
      transactionsNeeded,
      totalContractValue,
      totalAtlantisPays,
      totalSellerPayout,
      totalConsultantFees,
      totalAtlantisSavings,
      actualBuyerDiscount: ((marketValue - atlantisPays) / marketValue * 100),
      actualConsultantPercent: (consultantCommission / marketValue * 100),
      sellerNetMargin: ((sellerNetPayout - atlantisPays) / atlantisPays * 100)
    });
  };

  useEffect(() => {
    calculateTranche();
  }, [btcPrice, trancheSize, customTrancheSize, totalTarget]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatBTC = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportData = () => {
    if (!results) return;
    
    const data = {
      calculationDate: new Date().toISOString(),
      btcPrice: btcPrice,
      trancheSize: results.size,
      dealStructure: {
        totalDiscount: TOTAL_DISCOUNT,
        netBuyerDiscount: NET_BUYER_DISCOUNT,
        sellerMargin: SELLER_MARGIN,
        consultantFee: CONSULTANT_FEE
      },
      singleTranche: {
        marketValue: results.marketValue,
        atlantisPays: results.atlantisPays,
        sellerNetPayout: results.sellerNetPayout,
        consultantCommission: results.consultantCommission,
        atlantisSavings: results.atlantisSavings
      },
      fullContract: {
        totalTarget: totalTarget,
        transactionsNeeded: results.transactionsNeeded,
        totalContractValue: results.totalContractValue,
        totalAtlantisPays: results.totalAtlantisPays,
        totalSellerPayout: results.totalSellerPayout,
        totalConsultantFees: results.totalConsultantFees,
        totalAtlantisSavings: results.totalAtlantisSavings
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `btc-tranche-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="header">
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, #f97316, #ec4899)',
          borderRadius: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '2rem'
        }}>
          ₿
        </div>
        <h1>BTC Tranche Calculator</h1>
        <p>Atlantis Group USA Corp - Premium Deal Analysis Platform</p>
        <div className="reference">
          🛡️ REF: ATLGRU-60K-12-07-UBS-17025
        </div>
      </div>

      <div className="card">
        <div className="input-grid">
          <div className="input-group">
            <label>₿ BTC Price (USD)</label>
            <input
              type="number"
              value={btcPrice}
              onChange={(e) => setBtcPrice(parseFloat(e.target.value) || 0)}
              placeholder="Current BTC price"
            />
          </div>

          <div className="input-group">
            <label>📊 Standard Tranche</label>
            <select
              value={trancheSize}
              onChange={(e) => {
                setTrancheSize(parseInt(e.target.value));
                setCustomTrancheSize('');
              }}
            >
              <option value={4000}>4,000 BTC</option>
              <option value={5000}>5,000 BTC</option>
              <option value={6000}>6,000 BTC</option>
            </select>
          </div>

          <div className="input-group">
            <label>⚡ Custom Tranche</label>
            <input
              type="number"
              value={customTrancheSize}
              onChange={(e) => setCustomTrancheSize(e.target.value)}
              placeholder="Custom BTC amount"
            />
          </div>

          <div className="input-group">
            <label>🎯 Total Target (BTC)</label>
            <input
              type="number"
              value={totalTarget}
              onChange={(e) => setTotalTarget(parseFloat(e.target.value) || 0)}
              placeholder="Total BTC target"
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card red">
          <h4>Total Discount</h4>
          <div className="value">{TOTAL_DISCOUNT}%</div>
        </div>
        <div className="stat-card blue">
          <h4>Net Buyer Discount</h4>
          <div className="value">{NET_BUYER_DISCOUNT}%</div>
        </div>
        <div className="stat-card green">
          <h4>Seller Margin</h4>
          <div className="value">{SELLER_MARGIN}%</div>
        </div>
        <div className="stat-card orange">
          <h4>Consultant Fee</h4>
          <div className="value">{CONSULTANT_FEE}%</div>
        </div>
      </div>

      {results && (
        <>
          <div className="card">
            <div className="section-header">
              <div className="section-title">
                📊 Single Tranche Analysis
                <span className="badge">{formatBTC(results.size)} BTC</span>
              </div>
              <button onClick={exportData} className="export-btn">
                📥 Export Data
              </button>
            </div>

            <div className="results-grid">
              <div className="result-card">
                <h4>Market Value</h4>
                <div className="amount">{formatCurrency(results.marketValue)}</div>
                <div className="subtitle">{formatBTC(results.size)} BTC × {formatCurrency(btcPrice)}</div>
              </div>

              <div className="result-card">
                <h4>Atlantis Pays</h4>
                <div className="amount">{formatCurrency(results.atlantisPays)}</div>
                <div className="subtitle">{formatCurrency(results.pricePerBTC)} per BTC</div>
              </div>

              <div className="result-card">
                <h4>Seller Net Payout</h4>
                <div className="amount">{formatCurrency(results.sellerNetPayout)}</div>
                <div className="subtitle">After consultant fee</div>
              </div>

              <div className="result-card">
                <h4>Consultant Commission</h4>
                <div className="amount">{formatCurrency(results.consultantCommission)}</div>
                <div className="subtitle">{CONSULTANT_FEE}% of market value</div>
              </div>
            </div>

            <div className="flow-grid">
              <div className="flow-card">
                <h4>💰 Atlantis Savings</h4>
                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px'}}>
                  {formatCurrency(results.atlantisSavings)}
                </div>
                <div>{results.actualBuyerDiscount.toFixed(2)}% discount achieved</div>
              </div>

              <div className="flow-card">
                <h4>💸 Payment Flow</h4>
                <div className="flow-item">
                  <span className="label">Atlantis → Seller:</span>
                  <span className="amount green">{formatCurrency(results.atlantisPays)}</span>
                </div>
                <div className="flow-item">
                  <span className="label">Seller → Consultant:</span>
                  <span className="amount orange">{formatCurrency(results.consultantCommission)}</span>
                </div>
                <div className="flow-item">
                  <span className="label">Seller Net:</span>
                  <span className="amount purple">{formatCurrency(results.sellerNetPayout)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title">
              🌍 Full Contract Summary
              <span className="badge">{formatBTC(totalTarget)} BTC Target</span>
            </div>

            <div className="results-grid">
              <div className="result-card">
                <h4>Transactions Needed</h4>
                <div className="amount" style={{fontSize: '3rem'}}>{results.transactionsNeeded}</div>
                <div className="subtitle">Daily tranches required</div>
              </div>

              <div className="result-card">
                <h4>Total Contract Value</h4>
                <div className="amount">{formatCurrency(results.totalContractValue)}</div>
                <div className="subtitle">Market value of all BTC</div>
              </div>

              <div className="result-card">
                <h4>Total Atlantis Payment</h4>
                <div className="amount">{formatCurrency(results.totalAtlantisPays)}</div>
                <div className="subtitle">Total buyer payment</div>
              </div>

              <div className="result-card">
                <h4>Total Seller Payout</h4>
                <div className="amount">{formatCurrency(results.totalSellerPayout)}</div>
                <div className="subtitle">After all consultant fees</div>
              </div>

              <div className="result-card">
                <h4>Total Consultant Fees</h4>
                <div className="amount">{formatCurrency(results.totalConsultantFees)}</div>
                <div className="subtitle">Zampolli group earnings</div>
              </div>

              <div className="result-card">
                <h4>Total Atlantis Savings</h4>
                <div className="amount">{formatCurrency(results.totalAtlantisSavings)}</div>
                <div className="subtitle">vs market price</div>
              </div>
            </div>
          </div>

          <div className="terms-section">
            <h3>🛡️ Key Deal Terms Reference</h3>
            <div className="terms-grid">
              <div>
                <h4>⏰ Transaction Process:</h4>
                <ul className="terms-list">
                  <li>Initial test: 1 BTC + €100K security</li>
                  <li>Daily tranches: 4,000-6,000 BTC</li>
                  <li>Settlement: Face-to-face at UBS Zurich</li>
                  <li>Payment: EURO/USDT/FIAT combination</li>
                </ul>
              </div>
              <div>
                <h4>🛡️ Compliance Requirements:</h4>
                <ul className="terms-list">
                  <li>Wallet KYC/AML verification</li>
                  <li>Clean wallet (min 2,000 BTC, &lt;100 txs)</li>
                  <li>SPA, IMFPA, NCNDA execution</li>
                  <li>Mandate authorization (valid until 2025)</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BTCTrancheCalculator />
    </div>
  );
}

export default App;