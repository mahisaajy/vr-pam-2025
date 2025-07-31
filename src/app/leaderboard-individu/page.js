'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Head from 'next/head';
import Link from 'next/link';

export default function LeaderboardIndividuPage() {
  const [individualData, setIndividualData] = useState([]);

  const csvUrl =
    'https://docs.google.com/spreadsheets/d/1v8O9eNMV1V-X_faePxAh-DGhPZAune4S_0oDGKXlfTw/gviz/tq?tqx=out:csv';

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const rows = results.data;

            const allIndividuals = {};

            rows.forEach((row) => {
              const name = row['Nama Peserta']?.trim();
              const group = row['Pilih Nama Group']?.trim() || '-';
              const kmStr = row['Jarak Lari yang Diselesaikan (dalam Kilometer)']?.trim();
              const statusValidasi = row['Status Validasi']?.trim(); // Tambahan kolom status
              const km = parseFloat(kmStr);

              // Skip kalau tidak valid atau nilai tidak sesuai
              if (!name || isNaN(km) || statusValidasi === 'Tidak Valid') return;

              const key = `${name}|${group}`;

              if (!allIndividuals[key]) {
                allIndividuals[key] = {
                  name,
                  group,
                  totalKm: 0,
                };
              }

              allIndividuals[key].totalKm += km;
            });

            const sortedData = Object.values(allIndividuals)
              .sort((a, b) => b.totalKm - a.totalKm);

            setIndividualData(sortedData);
          },
        });
      });
  }, []);

  return (
    <>
      <Head>
        <title>Leaderboard Individu - Virtual Run RW 10</title>
      </Head>

      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Virtual Run RW 10</h2>
        <nav className="space-x-4 text-sm">
          <Link href="/" className="text-gray-700 hover:underline">Beranda</Link>
          <Link href="/leaderboard-group" className="text-gray-700 hover:underline">Leaderboard Group</Link>
          <Link href="/leaderboard-individu" className="text-gray-700 hover:underline font-bold">Leaderboard Individu</Link>
        </nav>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">🏃‍♂️ Leaderboard Lari per Individu</h1>

        {individualData.length > 0 ? (
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">#</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Nama Peserta</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Group</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Total KM</th>
                </tr>
              </thead>
              <tbody>
                {individualData.map((item, index) => (
                  <tr key={`${item.name}-${item.group}`} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.group}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.totalKm.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading leaderboard...</p>
        )}
      </main>
    </>
  );
}
