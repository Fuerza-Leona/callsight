import React from 'react';

const ProviderBase = () => {
  return (
    <div
      className="pointer-events-none absolute -inset-[100%] opacity-[55%] provider_base"
      style={{
        backgroundImage: 'url("/black-noise.png")',
      }}
    />
  );
};

export default ProviderBase;
