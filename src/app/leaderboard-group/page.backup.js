'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const csvUrl =
    'https://docs.google.com/spreadsheets/d/1v8O9eNMV1V-X_faePxAh-DGhPZAune4S_0oDGKXlfTw/gviz/tq?tqx=out:csv';

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setData(results.data);
            setHeaders(results.meta.fields || []);
          },
        });
      });
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>

      {data.length > 0 ? (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 px-4 py-2 bg-gray-100 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="border border-gray-200 px-4 py-2"
                    >
                      {row[header]}
                    </td>
                  ))}
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
