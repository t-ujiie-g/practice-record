import Link from 'next/link';

const HomePage = () => {
  console.log("test");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4">
        <Link href="/submit" className="text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-6 rounded">
            登録
        </Link>
        <Link href="/record" className="text-2xl bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-6 rounded">
            記録
        </Link>
      </div>
    </div>
  );
};

export default HomePage;