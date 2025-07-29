'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

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

            // Kelompokkan berdasarkan nama grup dan jumlahkan jaraknya
            const groupMap = {};

            rows.forEach((row) => {
              const group = row['Pilih Nama Group']?.trim();
              const kmStr = row['Jarak Lari yang Diselesaikan (dalam Kilometer)']?.trim();
              const km = parseFloat(kmStr);

              if (!group || isNaN(km)) return;

              if (!groupMap[group]) {
                groupMap[group] = 0;
              }

              groupMap[group] += km;
            });

            // Ubah jadi array dan urutkan descending
            const groupArray = Object.entries(groupMap)
              .map(([group, totalKm]) => ({ group, totalKm }))
              .sort((a, b) => b.totalKm - a.totalKm);

            setGroupData(groupArray);
          },
        });
      });
  }, []);

  return (
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
  );
}
