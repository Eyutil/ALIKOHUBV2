'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateVIPPass() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    level: 'standard'
  });
  const [qrImage, setQrImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/vip/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const { qrImage } = await res.json();
    setQrImage(qrImage);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="block w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Generate VIP Pass
        </button>
      </form>
      {qrImage && <img src={qrImage} alt="VIP QR Code" className="mt-4" />}
    </div>
  );
}