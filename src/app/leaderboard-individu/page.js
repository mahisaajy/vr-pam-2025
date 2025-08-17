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
    "Budi": "178736634",
    "Yoga": "180437296",
    "Aji": "179228085",
    "Sarah": "179222077",
    "Wiwit": "108366480",
    "Handoyo": "176388185",
    "Jajang": "158812309",
    "Ivan": "96717522",
    "Ludi": "178974626",
    "Endang": "178837611",
    "Sandy Ramadhan": "63852539",
    "Juansyah Traganov": "178951763",
    "Arifki Fitrah Rubiansyah": "141987917",
    "Kokom Komariah": "177611991",
    "Ami Mudjiastuti": "82154780",
    "Mahisa Ajy Kusuma": "33351351",
    "Ari Rusiandari": "178531974",
    "Widiasih Nurhayati": "178532500",
    "Riska Mustikasari": "178624937",
    "Nur Rokhim": "178531998",
    "Elis": "177641184",
    "Bilal": "128052116",
    "Reky Pramudia": "",
    "Tauhid": "178906479",
    "Hakim": "165961880",
    "Mba Diyu": "179628887",
    "Tante Ida": "176738044",
    "Mas Odeng": "179687245",
    "Kiki": "173692644",
    "Galih": "114859072",
    "Rinto": "72825198",
    "Mba Yuni": "178174293",
    "Bu Irma": "179534640",
    "Upi": "144893039",
    "Adam": "151014622",
    "Aries Purwanto": "68255983",
    "Okti Artika Rakhmah": "179297617",
    "Fakhri Surya Pratama": "165625640",
    "Djoni Waskito": "176716443",
    "Tri Setiyoto": "74799275",
    "Hisabudin": "177432941",
    "Rani Anggriani": "179573110",
    "Taufik Hidayat": "177363890",
    "Indra Feriadi": "178714846",
    "Setyorahardjo": "177361693",
    "Bambang": "178771629",
    "Heri S.": "177365491",
    "Ahmad": "176917385",
    "Asep": "178879574",
    "Putri Melati": "64362772",
    "Andar": "174293159",
    "Asep E.": "170453553",
    "Sumarna": "173711374",
    "Arman K.": "88668773",
    "Ria": "178743946"
  };

  const pesertaBelumAdaAktivitas = {
    "Budi": "RT01",
    "Sarah": "RT01",
    "Hakim": "RT04",
    "Taufik Hidayat": "RT07"
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

            // Inisialisasi semua peserta dari stravaProfiles (KM = 0)
            Object.keys(stravaProfiles).forEach((name) => {
              allIndividuals[name] = {
                name,
                group: pesertaBelumAdaAktivitas[name] || '-', // isi group dari pesertaTambahan kalau ada
                totalKm: 0
              };
            });


            // // Inisialisasi semua peserta dengan KM = 0
            // pesertaTetap.forEach((name) => {
            //   allIndividuals[name] = {
            //     name,
            //     group: '-', // nanti bisa diisi dari master list kalau ada
            //     totalKm: 0,
            //   };
            // });

            // Update dari CSV
            rows.forEach((row) => {
              const name = row['Nama Peserta']?.trim();
              const group = row['Pilih Nama Group']?.trim() || '-';
              const kmStr = row['Jarak Lari yang Diselesaikan (dalam Kilometer)']?.trim();
              const statusValidasi = row['Status Validasi']?.trim();
              const km = parseFloat(kmStr);

              if (!name || isNaN(km) || statusValidasi === 'Tidak Valid') return;

              if (!allIndividuals[name]) {
                allIndividuals[name] = { name, group, totalKm: 0 };
              }

              allIndividuals[name].group = group;
              allIndividuals[name].totalKm += km;
            });

            // Sort data
            const sortedData = Object.values(allIndividuals).sort((a, b) => b.totalKm - a.totalKm);

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
          <Link href="/statistik" className="text-gray-700 hover:underline">Statistik</Link>
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
                      <div className="flex flex-wrap items-center gap-2 break-all">
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



                    {/* <td className="border border-gray-200 px-4 py-2">{item.group}</td> */}
                    <td className="border border-gray-200 px-4 py-2">
                      {item.group?.replace(/\s+/g, '')}
                    </td>
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
