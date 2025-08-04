'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Head from 'next/head';
import Link from 'next/link';

export default function LeaderboardIndividuPage() {
  const [individualData, setIndividualData] = useState([]);

  // const stravaProfiles = {
  //   "Handoyo": "176388185",
  //   "Sandy Ramadhan": "63852539",
  //   "Adam Juliansyah": "151014622",
  //   "Ami Mudjiastuti": "82154780",
  //   "Andar": "174293159",
  //   "Ari Rusiandari": "178531974",
  //   "Aries Purwanto": "68255983",
  //   "Arifki Fitra Rubiansyah": "141987917",
  //   "Bambang": "178771629",
  //   "Bilal": "128052116",
  //   "Budi": "178736634",
  //   "Elis": "177641184",
  //   "Endang": "178837611",
  //   "Febrian Galih": "114859072",
  //   "Fernida Kristanti": "176738044",
  //   "Fakhri Surya Pratama": "165625640",
  //   "Hisabudin": "177432941",
  //   // tambahkan sisanya sesuai data kamu
  // };

  const stravaProfiles = {
    "Adam Juliansyah": "151014622",
    "Ami Mudjiastuti": "82154780",
    "Andar": "174293159",
    "Ari Rusiandari": "178531974",
    "Aries Purwanto": "68255983",
    "Arifki Fitra Rubiansyah": "141987917",
    // "Arswendy Aminuddin": "81057629",
    "Bambang": "178771629",
    "Bilal": "128052116",
    "Budi": "178736634",
    "Elis": "177641184",
    "Endang": "178837611",
    "Fakhri Surya Pratama": "165625640",
    "Febrian Galih": "114859072",
    "Fernida Kristanti": "176738044",
    "Handoyo": "176388185",
    "Hisabudin": "177432941",
    "Jajang": "158812309",
    "Juansyah Traganov": "178951763",
    "Kokom Komariah": "177611991",
    "Lilis Minkeliswati": "179040728",
    "Ludi": "178974626",
    "Lutfi Darajat": "144893039",
    "Mahisa Ajy Kusuma": "33351351",
    "Nur Rokhim": "178531998",
    "Oktari Wahyuni": "178174293",
    "okti artika rakhmah": "179297617",
    "Putri Melati": "64362772",
    "Ramdhani Adji": "179228085",
    "Rani Anggriani": "179573110",
    "Ria Arman": "178743946",
    "Rinto Hermawan": "72825198",
    "Riska Mustikasari": "178624937",
    "Sandy Ramadhan": "63852539",
    "Sarah Puspita": "179222077",
    "Sumarna Anramus": "173711374",
    "Toid Hakim": "178906479",
    "Tri Setiyoto": "74799275",
    "Tyo Rahardjo": "177361693",
    "Widiasih Nurhayati": "178532500",
    "muhammad rizky": "173692644"
  };


  const stravaIconUrl = "https://cdn.worldvectorlogo.com/logos/strava-2.svg";


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
                    {/* <td className="border border-gray-200 px-4 py-2">{item.name}</td> */}
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex items-center space-x-2 whitespace-nowrap overflow-hidden">
                        <span>{item.name}</span>
                        {stravaProfiles[item.name] && (
                          <a
                            href={`https://www.strava.com/athletes/${stravaProfiles[item.name]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lihat di Strava"
                          >
                            <img
                              src={stravaIconUrl}
                              alt="Strava"
                              className="w-4 h-4 opacity-80 hover:opacity-100"
                            />
                          </a>
                        )}
                      </div>
                    </td>


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
