import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { FiRefreshCw } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { Raleway } from "next/font/google";
import { useState } from "react";

const raleway = Raleway({ subsets: ["latin"] });

type Quote = {
  _id: string;
  quoteText: string;
  quoteAuthor: string;
  quoteGenre: string;
  __v: number;
};

export const getStaticProps: GetStaticProps<{
  quote: Quote;
}> = async () => {
  const res = await fetch(
    `https://quote-garden.onrender.com/api/v3/quotes/random`
  );
  const data = await res.json();
  const quotes = await data.data;
  return { props: { quote: quotes[0] } };
};

export default function Home({
  quote,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [data, setData] = useState(quote);
  return (
    <main
      className={`p-0 box-border w-screen h-screen flex flex-col bg-white text-black py-[20px] px-[36px] ${raleway.className}`}
    >
      <header className="w-full h-[24px] flex items-center justify-end">
        <div className="flex items-center text-xl font-medium hover:cursor-pointer">
          random <FiRefreshCw className="ml-2" />
        </div>
      </header>
      <section className="pt-3 h-full w-full flex flex-col items-center">
        <div className="w-[614px] mb-4 pl-8">
          <p className="m-0 font-bold text-2xl">Bill Gate</p>
        </div>
        <div className="w-[614px] mb-4 pl-8 border-l-8 border-yellow-400">
          <p className="text-2xl font-medium">{data?.quoteText}</p>
        </div>
        <div className="mt-2 px-[10px] py-[20px] flex w-[580px] bg-white items-center justify-between hover:bg-black hover:text-white hover:cursor-pointer">
          <div>
            <p className="m-0 font-medium text-2xl ">{data?.quoteAuthor}</p>
            <p className="m-0 font-thin text-[12px]">bussiness</p>
          </div>
          <div>
            <BsArrowRight />
          </div>
        </div>
      </section>
      <footer className="justify-self-end">
        <div className="w-full flex justify-center">
          <p className="font-light">created by dedi-dev - devChallenges.io</p>
        </div>
      </footer>
    </main>
  );
}
