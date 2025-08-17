'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Head from 'next/head';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrasi Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatistikPage() {
  const [chartData, setChartData] = useState(null);

  const csvUrl =
    'https://docs.google.com/spreadsheets/d/1v8O9eNMV1V-X_faePxAh-DGhPZAune4S_0oDGKXlfTw/gviz/tq?tqx=out:csv';

  // Parser tanggal yang tahan format "MM/DD/YYYY" atau "DD/MM/YYYY"
  function parseDateSmart(input) {
    if (!input) return null;
    const s = String(input).trim().replace(/^"|"$/g, ''); // buang quote CSV jika ada

    // Kalau sudah ISO atau ada "T", biarkan JS parse
    if (/^\d{4}-\d{2}-\d{2}/.test(s) || s.includes('T')) {
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    // Ambil hanya bagian tanggal (buang waktu kalau ada)
    const onlyDate = s.split(' ')[0];
    const parts = onlyDate.split(/[\/\-\.]/).map(p => p.trim());

    if (parts.length !== 3) return null;

    let a = parseInt(parts[0], 10);
    let b = parseInt(parts[1], 10);
    let c = parseInt(parts[2], 10);

    if ([a, b, c].some(n => isNaN(n))) return null;

    // Heuristik:
    // - Jika a > 12 -> pasti DD/MM/YYYY
    // - Jika b > 12 -> pasti MM/DD/YYYY
    // - Lainnya ambigu -> default ke MM/DD/YYYY (sesuai contohmu "8/3/2025" = 3 Agustus)
    let day, month, year;
    if (a > 12 && b <= 12) {
      day = a; month = b; year = c;            // DD/MM/YYYY
    } else if (b > 12 && a <= 12) {
      day = b; month = a; year = c;            // MM/DD/YYYY
    } else {
      day = b; month = a; year = c;            // default MM/DD/YYYY
    }

    const d = new Date(year, month - 1, day);
    return isNaN(d) ? null : d;
  }

  // Format label singkat: "3 Agu 2025"
  function formatDateIdShort(date) {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data;

            // cari kolom tanggal & status validasi
            const sampleRow = rows[0] || {};
            const tanggalKey = Object.keys(sampleRow).find((k) =>
              k && k.toLowerCase().includes('tanggal')
            );
            const statusKey = Object.keys(sampleRow).find((k) =>
              k && k.toLowerCase().includes('status') && k.toLowerCase().includes('valid')
            );

            // Hitung jumlah aktivitas per tanggal (valid saja)
            const countsByIso = new Map(); // key: 'YYYY-MM-DD' -> count
            rows.forEach((row) => {
              const status = (row[statusKey] || '').toString().trim();
              if (status === 'Tidak Valid') return;

              const rawDate = row[tanggalKey];
              const d = parseDateSmart(rawDate);
              if (!d) return;

              // Kunci ISO harian
              const isoKey = [
                d.getFullYear(),
                String(d.getMonth() + 1).padStart(2, '0'),
                String(d.getDate()).padStart(2, '0'),
              ].join('-');

              countsByIso.set(isoKey, (countsByIso.get(isoKey) || 0) + 1);
            });

            // Urutkan tanggal
            const sortedIsoDates = Array.from(countsByIso.keys()).sort();

            // Siapkan labels & data
            const labels = sortedIsoDates.map((iso) => {
              const [y, m, dd] = iso.split('-').map(Number);
              const d = new Date(y, m - 1, dd);
              return formatDateIdShort(d); // "3 Agu 2025"
            });
            const data = sortedIsoDates.map((iso) => countsByIso.get(iso));

            setChartData({
              labels,
              datasets: [
                {
                  label: 'Jumlah Aktivitas',
                  data,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            });
          },
        });
      });
  }, []);

  return (
    <>
      <Head>
        <title>Statistik Aktivitas - Virtual Run RW 10</title>
      </Head>

      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Virtual Run RW 10</h2>
        <nav className="space-x-4 text-sm">
          <Link href="/" className="text-gray-700 hover:underline">Beranda</Link>
          <Link href="/leaderboard-group" className="text-gray-700 hover:underline">Leaderboard Group</Link>
          <Link href="/leaderboard-individu" className="text-gray-700 hover:underline">Leaderboard Individu</Link>
          <Link href="/statistik" className="text-gray-700 hover:underline font-bold">Statistik</Link>
        </nav>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">📊 Statistik Aktivitas Harian</h1>

        {chartData ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Container tinggi adaptif supaya tetap besar di HP */}
            <div className="w-full h-[420px] sm:h-[480px] md:h-[560px]">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: { boxWidth: 12, boxHeight: 12 },
                    },
                    title: {
                      display: true,
                      text: 'Jumlah Aktivitas per Hari',
                    },
                    tooltip: {
                      callbacks: {
                        title: (items) => items[0]?.label || '',
                      },
                    },
                  },
                  layout: { padding: 8 },
                  scales: {
                    x: {
                      ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0,
                        font: { size: 12 },
                      },
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1, font: { size: 12 } },
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </main>
    </>
  );
}
