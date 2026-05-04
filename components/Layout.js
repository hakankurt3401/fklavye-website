import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from './Header';

export default function Layout({ children, title = 'F Klavye Uçan Parmaklar Derneği' }) {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="F Klavye Uçan Parmaklar Derneği resmi web sitesi" />
      </Head>

      <Header />

      <main className="flex-1 bg-blue-100">
        {children}
      </main>

      <footer className="bg-blue-200 text-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">Copyright © 2026 - Her Hakkı Saklıdır. Kopyalanması, çoğaltılması ve dağıtılması halinde yasal haklarımız işletilecektir.</p>
        </div>
      </footer>
    </div>
  );
}