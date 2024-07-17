import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//=== google firebase import start ===
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
// ===================================
import { toast } from "react-toastify";

const Contextpage = createContext();

export function MovieProvider({ children }) {
  const [header, setHeader] = useState("Trending");
  const [totalPage, setTotalPage] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [page, setPage] = useState(1);
  const [activegenre, setActiveGenre] = useState(28);
  const [genres, setGenres] = useState([]);
  const [loader, setLoader] = useState(true);
  const [backgenre, setBackGenre] = useState(false);
  const [user, setUser] = useAuthState(auth); //=======> firebase custom hooks state
  const navigate = useNavigate(); // =====> navigate page

  const APIKEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (page < 1) {
      setPage(1); // Increment page to 1 if it is less than 1.
    }
  }, [page]);

  const filteredGenre = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${activegenre}&api_key=${APIKEY}&language=ko-KR&page=${page}`
    );
    const filteredGenre = await data.json();

    const newMovies = [...movies, ...filteredGenre.results].reduce(
      (acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      },
      []
    );

    setMovies(newMovies);
    setTotalPage(filteredGenre.total_pages);
    setLoader(false);
    setHeader("장르");
  };

  const fetchSearch = async (query) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&with_origin_country=KR&language=ko-KR&query=${query}&page=1&include_adult=true`
    );
    const searchmovies = await data.json();
    setSearchedMovies(searchmovies.results);
    setLoader(false);
    setHeader(`Results for "${query}"`);
  };
  const fetchAnime = async () => {
    const data = await fetch(
      // `https://api.themoviedb.org/3/discover/movie?with_genres=${activegenre}&api_key=${APIKEY}&with_keywords=210024|287501&page=${page}`
      `https://api.themoviedb.org/3/discover/movie?with_genres=${activegenre}&api_key=${APIKEY}&language=ko-KR&with_keywords=210024|287501&page=${page}`
    );
    const filteredGenre = await data.json();

    const newMovies = [...movies, ...filteredGenre.results].reduce(
      (acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      },
      []
    );

    setMovies(newMovies);
    setTotalPage(filteredGenre.total_pages);
    setLoader(false);
    setHeader("애니메이션");
  };

  const fetchGenre = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&with_origin_country=KR&language=ko-KR`
    );
    const gen = await data.json();
    setGenres(gen.genres);
  };
  const fetchTrending = async () => {
    const data = await fetch(
      // `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}&with_origin_country=KR&page=${page}`
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIKEY}&language=ko-KR&with_origin_country=KR&page=${page}`
    );
    const trend = await data.json();

    // 새로운 영화를 추가하되 중복을 제거
    const newTrending = [...trending, ...trend.results].reduce(
      (acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      },
      []
    );

    setTrending(newTrending);
    setTotalPage(trend.total_pages);
    setLoader(false);
    setHeader("인기 영화");
  };

  const fetchUpcoming = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&with_origin_country=KR&language=ko-KR&page=${page}`
    );
    const upc = await data.json();

    const newUpcoming = [...upcoming, ...upc.results].reduce((acc, current) => {
      const x = acc.find((item) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    setUpcoming(newUpcoming);
    setTotalPage(upc.total_pages);
    setLoader(false);
    setHeader("최근 개봉영화");
  };

  // creat local storage
  const GetFavorite = () => {
    setLoader(false);
    setHeader("즐겨찾기");
  };

  //<========= firebase Google Authentication ========>
  const googleProvider = new GoogleAuthProvider(); // =====> google auth provide

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/");
      toast.success("Login successfully");
    } catch (err) {
      console.log(err);
      navigate("/");
    }
  };
  // <==========================================================>

  return (
    <Contextpage.Provider
      value={{
        fetchGenre,
        genres,
        setGenres,
        filteredGenre,
        header,
        setHeader,
        movies,
        setMovies,
        page,
        setPage,
        activegenre,
        setActiveGenre,
        fetchSearch,
        fetchAnime,
        loader,
        setBackGenre,
        backgenre,
        setLoader,
        fetchTrending,
        trending,
        fetchUpcoming,
        upcoming,
        GetFavorite,
        totalPage,
        searchedMovies,
        GoogleLogin,
        user,
      }}
    >
      {children}
    </Contextpage.Provider>
  );
}

export default Contextpage;
