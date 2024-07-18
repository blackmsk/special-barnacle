import React, { useEffect, useContext } from "react";
import Contextpage from "../Contextpage";
import Moviecard from "../components/Moviecard";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
// import { Pagebtn } from '../components/Pagebtn';
import { Helmet } from "react-helmet";
import InfiniteScroll from "react-infinite-scroll-component";

function Top_Rated() {
  const { loader, page, setPage, fetchTop_Rated, top_rated, totalPage } =
    useContext(Contextpage);

  useEffect(() => {
    setPage(1); // Reset Page to 1 on initial render.
  }, []);

  useEffect(() => {
    if (page > 0) {
      fetchTop_Rated();
    }
  }, [page]);

  return (
    <>
      <Helmet>
        <title>하명이의 영화채널 | 명예의 전당</title>
      </Helmet>

      <div className="w-full bg-[#10141e] md:p-10 mb-20 md:mb-0">
        <Header />
        <motion.div
          layout
          className="flex flex-wrap relative justify-evenly md:justify-around"
        >
          <AnimatePresence>
            {loader ? (
              <span className="loader m-10"></span>
            ) : (
              <>
                <InfiniteScroll
                  className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around"
                  dataLength={top_rated.length} //This is important field to render the next data
                  next={() => setPage(page + 1)}
                  hasMore={page < totalPage}
                  loader={<span className="loader m-10"></span>}
                  scrollThreshol={0.9}
                  style={{ overflow: "hidden" }}
                >
                  {top_rated.map((top) => (
                    <Moviecard key={top.id} movie={top} />
                  ))}
                </InfiniteScroll>
              </>
            )}
          </AnimatePresence>
        </motion.div>
        {/* <Pagebtn /> */}
      </div>
    </>
  );
}

export default Top_Rated;
