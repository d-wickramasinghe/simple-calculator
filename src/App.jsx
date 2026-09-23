import React from 'react';
import Calculator from './components/Calculator';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1011', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Calculator />
    </div>
  );
}
