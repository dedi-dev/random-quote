// import type { InferGetStaticPropsType, GetStaticProps } from "next";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { FiRefreshCw } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { Raleway } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const raleway = Raleway({ subsets: ["latin"] });

type Quote = {
  _id: string;
  quoteText: string;
  quoteAuthor: string;
  quoteGenre: string;
  __v: number;
};

export const getServerSideProps: GetServerSideProps<{
  quote: Quote;
}> = async () => {
  let quote = {
    _id: "",
    quoteText: "",
    quoteAuthor: "",
    quoteGenre: "",
    __v: 0,
  };
  const res = await axios.get(
    `https://quote-garden.onrender.com/api/v3/quotes/random`
  );
  if (res?.data?.data[0]) {
    quote = res?.data?.data[0];
  }
  return { props: { quote } };
};

export default function Home({
  quote,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [data, setData] = useState<Quote>(quote);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const reload = () => {
    axios
      .get(`https://quote-garden.onrender.com/api/v3/quotes/random`)
      .then((res) => {
        setData(res.data.data[0]);
        setQuotes([]);
      });
  };

  const getQuotesByAuthor = () => {
    axios
      .get(`https://quote-garden.onrender.com/api/v3/quotes`, {
        params: {
          author: data.quoteAuthor,
        },
      })
      .then((res) => {
        setQuotes(res.data.data);
      });
  };

  useEffect(() => {
    // reload();
  }, []);

  return (
    <main
      className={`p-0 box-border min-w-screen min-h-screen flex flex-col bg-white text-black px-[36px] ${raleway.className}`}
    >
      <header className="w-full h-14 flex items-center justify-end fixed left-0 top-0 px-[36px] bg-white">
        <div
          onClick={reload}
          className="flex items-center text-xl font-medium hover:cursor-pointer"
        >
          random <FiRefreshCw className="ml-2" />
        </div>
      </header>
      <section className="pt-3 h-full w-full flex flex-col items-center mt-14">
        <div className="w-[614px] mb-4 pl-8">
          <p
            className={`m-0 font-bold text-2xl ${
              !quotes.length ? "hidden" : ""
            }`}
          >
            {data?.quoteAuthor}
          </p>
        </div>
        {!quotes.length ? (
          <div className="w-[614px] mb-8 pl-8 border-l-8 border-yellow-400">
            <p className="text-2xl font-medium">{`"${data?.quoteText}"`}</p>
          </div>
        ) : (
          quotes.map((q) => {
            return (
              <div
                key={q._id}
                className="w-[614px] mb-8 pl-8 border-l-8 border-yellow-400"
              >
                <p className="text-2xl font-medium">{`"${q?.quoteText}"`}</p>
              </div>
            );
          })
        )}
        <div
          onClick={getQuotesByAuthor}
          className={`${
            quotes.length ? "hidden" : ""
          } mt-2 px-[10px] py-[20px] flex w-[580px] bg-white items-center justify-between hover:bg-black hover:text-white hover:cursor-pointer`}
        >
          <div>
            <p className="m-0 font-medium text-2xl ">{data?.quoteAuthor}</p>
            <p className="m-0 font-thin text-[12px]">{data?.quoteGenre}</p>
          </div>
          <div>
            <BsArrowRight />
          </div>
        </div>
      </section>
      <footer className="fixed left-0 bottom-0">
        <div className="w-screen h-10 flex justify-center items-center bg-white">
          <p className="font-light">created by dedi-dev - devChallenges.io</p>
        </div>
      </footer>
    </main>
  );
}
