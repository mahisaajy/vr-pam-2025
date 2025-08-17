'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Head from 'next/head';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [groupData, setGroupData] = useState([]);

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

            // Daftar grup yang valid sesuai gambar
            const validGroups = [
              'RT01',
              'RT02',
              'RT03 - Group 1',
              'RT03 - Group 2',
              'RT04',
              'RT06 - Group 1',
              'RT06 - Group 2',
              'RT07 - Group 1',
              'RT07 - Group 2',
              'RT08 - Group 1',
              'RT08 - Group 2',
            ];

            const groupTotals = {};
            validGroups.forEach((g) => (groupTotals[g] = 0));

            rows.forEach((row) => {
              const group = row['Pilih Nama Group']?.trim();
              const kmStr = row['Jarak Lari yang Diselesaikan (dalam Kilometer)']?.trim();
              const statusValidasi = row['Status Validasi']?.trim();
              const km = parseFloat(kmStr);

              if (!group || isNaN(km) || statusValidasi === 'Tidak Valid') return;

              if (group in groupTotals) {
                groupTotals[group] += km;
              }
            });

            const sortedData = Object.entries(groupTotals)
              .map(([group, totalKm]) => ({ group, totalKm }))
              .sort((a, b) => b.totalKm - a.totalKm);

            setGroupData(sortedData);
          },
        });
      });
  }, []);

  return (
    <>
      <Head>
        <title>Leaderboard Grup - Virtual Run RW 10</title>
      </Head>

      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Virtual Run RW 10</h2>
        <nav className="space-x-4 text-sm">
          <Link href="/" className="text-gray-700 hover:underline">Beranda</Link>
          <Link href="/leaderboard-group" className="text-gray-700 hover:underline font-bold">Leaderboard Group</Link>
          <Link href="/leaderboard-individu" className="text-gray-700 hover:underline">Leaderboard Individu</Link>
          <Link href="/statistik" className="text-gray-700 hover:underline">Statistik</Link>
        </nav>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">🏃‍♀️ Leaderboard Lari per Group</h1>

        {groupData.length > 0 ? (
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">#</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Nama Group</th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Total KM</th>
                </tr>
              </thead>
              <tbody>
                {groupData.map((item, index) => (
                  <tr key={item.group} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
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
