import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import AuthContext from '../store/auth-context';
import Navbar from '../components/Navbar/Navbar';
import './Home.css';

const Home = () => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const ctx = useContext(AuthContext);
  const fetchTrades = async () => {
    ctx.setIsLoading(true);
    const requestOptions = {};
    let token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : null;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    requestOptions.headers = headers;

    let fetchURL;
    fetchURL = 'http://localhost:8000/api/trades';

    try {
      const response = await fetch(fetchURL, requestOptions);
      const fetchedTrades = await response.json();
      setCurrentItems(fetchedTrades.data);
      setPageCount(fetchedTrades.last_page);
      setPreviousPageUrl(fetchedTrades.prev_page_url);
      setNextPageUrl(fetchedTrades.next_page_url);
      console.log(fetchedTrades.data);
      ctx.setIsLoading(true);
    } catch (err) {
      alert(err.message);
      ctx.setIsLoading(false);
    }
    ctx.setIsLoading(false);
  };

  useEffect(() => {
    // Fetch items from another resources.
    fetchTrades();
  }, []);

  if (ctx.isLoggedIn === false) {
    return <Navigate to='/login' />;
  }

  const handlePageClick = (event) => {};

  return (
    <>
      <Navbar />
      <main className='home-main-wrapper'>
        <h1>Trades</h1>
        <div className='table-container'>
          <table>
            <tr className='table-header'>
              <th>Login</th>
              <th>Action</th>
              <th>Entry</th>
              <th>Time</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Profit</th>
              <th>Volume</th>
            </tr>
            {currentItems &&
              currentItems.map((item) => (
                <tr>
                  <td>test</td>
                </tr>
              ))}
          </table>
        </div>
        <ReactPaginate
          breakLabel='...'
          nextLabel='next >'
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel='< previous'
          renderOnZeroPageCount={null}
        />
      </main>
    </>
  );
};

export default Home;
