import type { InferGetStaticPropsType, GetStaticProps } from "next";
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

export const getStaticProps: GetStaticProps<{
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
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [data, setData] = useState<Quote>(quote);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);

  const reload = () => {
    axios
      .get(`https://quote-garden.onrender.com/api/v3/quotes/random`)
      .then((res) => {
        setData(res.data.data[0]);
        setQuotes([]);
        setNextPage(null);
      });
  };

  const getQuotesByAuthor = (page: number) => {
    axios
      .get(`https://quote-garden.onrender.com/api/v3/quotes`, {
        params: {
          page,
          author: data.quoteAuthor,
        },
      })
      .then((res) => {
        setQuotes((prevItems) => [...prevItems, ...res.data.data]);
        setNextPage(res.data.pagination.nextPage);
      });
  };

  const handleScroll = () => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      if (nextPage) {
        getQuotesByAuthor(nextPage);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [nextPage]);

  return (
    <main
      className={`p-0 box-border min-w-screen min-h-screen flex flex-col items-center bg-white text-black px-[36px] ${raleway.className}`}
    >
      <header className="w-full h-14 flex items-center justify-end fixed left-0 top-0 px-[36px] bg-white">
        <div
          onClick={reload}
          className="flex items-center text-xl font-medium hover:cursor-pointer"
        >
          random <FiRefreshCw className="ml-2" />
        </div>
      </header>
      <section className="pt-3 h-full max-w-[614px] flex flex-col items-center mt-14">
        <div className="min-w-[263px] max-w-[400px] flex justify-start mb-8 self-start">
          <p
            className={`ml-[44px] font-bold text-2xl ${
              !quotes.length ? "hidden" : ""
            }`}
          >
            {data?.quoteAuthor}
          </p>
        </div>
        {!quotes.length ? (
          <div className="w-full mb-8 pl-8 border-l-8 border-yellow-400">
            <p className="text-2xl font-medium">{`"${data?.quoteText}"`}</p>
          </div>
        ) : (
          quotes.map((q) => {
            return (
              <div
                key={q._id}
                className="w-full mb-16 pl-8 border-l-8 border-yellow-400"
              >
                <p className="text-2xl font-medium">{`"${q?.quoteText}"`}</p>
              </div>
            );
          })
        )}
        <div
          onClick={() => getQuotesByAuthor(1)}
          className={`${
            quotes.length ? "hidden" : ""
          } mt-2 px-[10px] py-[20px] flex w-full max-w-[580px] bg-white items-center justify-between hover:bg-black hover:text-white hover:cursor-pointer`}
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
          <p className="font-light">
            created by{" "}
            <a
              className="hover:text-yellow-400"
              href="https://www.linkedin.com/in/dedi-20712119b/"
              target="_blank"
            >
              Dedi
            </a>
            {" - "}
            <a
              className="hover:text-yellow-400"
              href="https://devchallenges.io/"
              target="_blank"
            >
              devChallenges.io
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
