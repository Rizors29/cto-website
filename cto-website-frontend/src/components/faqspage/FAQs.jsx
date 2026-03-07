import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqData = [
  {
    id: 1,
    question: "Bagaimana cara mengajukan permintaan atau masalah IT?",
    answer: "Anda dapat mengajukannya di Formulir IT Service Request. Dari Menu Navbar > Forms > Request Form. Isi formulir dengan detail masalah atau permintaan Anda, dan tim kami akan segera memprosesnya.",
    category: "Layanan",
  },
  {
    id: 2,
    question: "Bagaimana cara mengajukan inventory baru?",
    answer: "Anda dapat mengajukannya di Formulir Inventory. Dari Menu Navbar > Forms > Inventory Form. Isi nama lengkap anda dan kategori perangkat lalu tim kami akan segera memprosesnya.",
    category: "Layanan",
  },
  {
    id: 3,
    question: "Berapa lama waktu untuk memproses dan menyelesaikan permintaan IT?",
    answer: "Waktu penyelesaian tergantung pada kompleksitas masalah yang dialami. Permintaan darurat mungkin ditangani dalam waktu yang lebih cepat dibandingkan permintaan umum.",
    category: "Layanan",
  },
  {
    id: 4,
    question: "Di mana saya bisa menemukan panduan atau dokumentasi teknologi terbaru?",
    answer: "Semua panduan dan dokumentasi terbaru tersedia di bagian 'Resources'. Anda dapat mencari panduan berdasarkan nama perangkat atau topik teknologi.",
    category: "Sumber Daya",
  },
  {
    id: 5,
    question: "Apa yang harus saya lakukan jika koneksi internet saya terputus?",
    answer: "Pertama, coba restart perangkat dan router Anda. Jika masalah berlanjut, segera laporkan melalui formulir IT Service Request untuk bantuan teknis lebih lanjut.",
    category: "Troubleshooting",
  },
];

const FaqItem = ({ faq, isOpen, toggleItem }) => {
  return (
    <div className="border-b border-gray-300">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-800 hover:text-blue-600 transition duration-150 cursor-pointer"
        onClick={toggleItem}
      >
        {faq.question}
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-blue-600' : 'text-gray-400'}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0'}`}
        style={{ maxHeight: isOpen ? '500px' : '0' }}
      >
        <p className="text-gray-600 pb-4 pr-6 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

function FAQs() {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4 bg-white rounded-lg border-1 border-gray-300 p-4">
        <h2 className="text-3xl font-semibold text-blue-950 mb-2">Frequently Asked Questions</h2>
      </div>

      <div className="bg-white rounded-lg p-6 md:p-8 border-1 border-gray-300">
        {faqData.map((faq) => (
          <FaqItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            toggleItem={() => toggleItem(faq.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQs;