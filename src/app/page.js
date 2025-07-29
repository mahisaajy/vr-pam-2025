'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white text-black">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/run.svg"
          alt="Virtual Run Logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="text-3xl font-bold text-center sm:text-left text-gray-800">
          Virtual Run RW 10 – Komplek PAM Jaya
        </h1>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left text-gray-600">
          <li className="mb-2 tracking-[-.01em]">
            Lihat rekap lari per grup, per individu, dan semua aktivitas.
          </li>
          <li className="tracking-[-.01em]">
            Data langsung dari Google Form peserta lari.
          </li>
        </ol>

        {/* Tombol Form Lapor Aktivitas */}
        <div className="w-full flex justify-center">
          <Link
            href="https://s.id/vr-rw10"
            className="rounded-full border border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            📋 Form Lapor Aktivitas
          </Link>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/leaderboard-group"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white gap-2 hover:bg-[#383838] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            🏆 Leaderboard Group
          </Link>
          <Link
            href="/leaderboard-individu"
            className="rounded-full border border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            🧍 Leaderboard Individu
          </Link>
          <Link
            href="/aktivitas"
            className="rounded-full border border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            📋 Semua Aktivitas
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-600">
        <span>RW 10 Komplek PAM Jaya</span>
        <span>Powered by Next.js + Google Form</span>
      </footer>
    </div>
  );
}
