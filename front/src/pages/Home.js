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
  const fetchTrades = async (page) => {
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
    fetchURL = `http://localhost:8000/api/trades?page=${page}`;

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
    fetchTrades(1);
  }, []);

  if (ctx.isLoggedIn === false) {
    return <Navigate to='/login' />;
  }

  const handlePageClick = (event) => {
    fetchTrades(event.selected + 1);
  };

  return (
    <>
      <Navbar />
      <main className='home-main-wrapper'>
        <div className='filter-container'>
          <form>
            <label for='deal'>Deal</label>
            <input id='deal' type='text' placeholder='Deal starts with ..' />
            <label for='login'>Login</label>
            <input id='deal' type='text' placeholder='Deal starts with ..' />
            <button type='submit'>Filter</button>
          </form>
        </div>
        <h1>Trades</h1>
        <div className='table-container'>
          <table>
            <thead>
              <tr className='table-header'>
                <th>Deal</th>
                <th>Login</th>
                <th>Action</th>
                <th>Entry</th>
                <th>Time</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Profit</th>
                <th>Volume</th>
              </tr>
            </thead>
            {currentItems &&
              currentItems.map((item) => (
                <tr key={item.Deal}>
                  <td>{item.Deal}</td>
                  <td>{item.Login}</td>
                  <td>{item.Action}</td>
                  <td>{item.Entry}</td>
                  <td>{item.Time}</td>
                  <td>{item.Symbol}</td>
                  <td>{item.Price}</td>
                  <td
                    style={{
                      color:
                        item.Profit > 0
                          ? '#004D00'
                          : item.Profit < 0
                          ? '#F70000'
                          : 'var(--tertiary-color)',
                    }}
                  >
                    {item.Profit}
                  </td>
                  <td>{item.Volume}</td>
                </tr>
              ))}
          </table>
        </div>
        <div className='react-paginate-container'>
          <ReactPaginate
            breakLabel='...'
            nextLabel='next >'
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel='< previous'
            renderOnZeroPageCount={null}
            activeLinkClassName='active-page-item'
            pageLinkClassName='page-link'
            previousLinkClassName='previous-link'
            nextLinkClassName='next-link'
          />
        </div>
      </main>
    </>
  );
};

export default Home;
