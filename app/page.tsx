import Head from 'next/head'
import Navbar from "./comps/Navbar"
export default function Home() {
  return (
    <div className="text-2xl text-slate-50 bg-base-100">
      <Head>
        <title>Raktbeej</title>
        <meta property="og:title" content="Raktbeej" key="title" />
      </Head>
     <Navbar/>
      <h1 className="justify-center">Nothing to see here for now</h1>
    </div>
  );
}
