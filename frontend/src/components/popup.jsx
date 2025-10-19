// components/Popup.js
import React from 'react';

function Popup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-yellow-200 via-white to-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
        <p className="mb-4">Thanks for visiting our site.</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Popup;