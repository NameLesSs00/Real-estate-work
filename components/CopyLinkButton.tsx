'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="w-12 h-12 bg-white border border-[#ECECEC] rounded-[10px] flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all group relative"
        title="Copy Link"
      >
        {copied ? (
          <Check size={20} className="text-green-500" />
        ) : (
          <Copy size={20} className="text-gray-500 group-hover:text-brand-primary transition-colors" />
        )}
        
        {/* Tooltip */}
        {copied && (
          <div className="absolute -top-10 right-0 bg-gray-800 text-white text-xs py-1.5 px-3 rounded whitespace-nowrap animate-in fade-in zoom-in duration-200">
            Link copied to the clipboard
          </div>
        )}
      </button>
    </div>
  );
};

export default CopyLinkButton;
