import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import AuthContext from '../store/auth-context';
import Navbar from '../components/Navbar/Navbar';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);
  if (!ctx.isLoggedIn) {
    navigate('/login', { replace: true });
  }

  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [dealFilter, setDealFilter] = useState(null);
  const [loginFilter, setLoginFilter] = useState(null);
  const [action, setAction] = useState(1);
  const [entry, setEntry] = useState(0);
  const [symbol, setSymbol] = useState('EURUSD-');
  const [price, setPrice] = useState(0);
  const [volume, setVolume] = useState(0);
  const [profit, setProfit] = useState(0);

  // Function to fetch trades
  const fetchTrades = async (page, queryParams = '') => {

    ctx.setIsLoading(true);
    const requestOptions = {};
    let token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : null;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };

    requestOptions.headers = headers;

    const fetchURL =
      ctx.isAdmin === 1
        ? `http://localhost:8000/api/trades?page=${page}&${queryParams}`
        : `http://localhost:8000/api/trades?page=${page}&Login=${ctx.userID}&${queryParams}`;
      
    try {
      const response = await fetch(fetchURL, requestOptions);
      const fetchedTrades = await response.json();
      setCurrentItems(fetchedTrades.data);
      setPageCount(fetchedTrades.last_page);
      setPreviousPageUrl(fetchedTrades.prev_page_url);
      setNextPageUrl(fetchedTrades.next_page_url);
      setCurrentPage(fetchedTrades.current_page);
      ctx.setIsLoading(false);
    } catch (err) {
      console.log(err.message);
      ctx.setIsLoading(false);
    }
    ctx.setIsLoading(false);
  };

  useEffect(() => {

    if (ctx.isLoggedIn) {
      setDealFilter(null);
      setLoginFilter(null);
      fetchTrades(1);
    }
    if (ctx.isLoggedIn === false) {
      return <Navigate to='/login' />;
    }
  
  }, [ctx.isLoggedIn]);

  // if (ctx.isLoggedIn === false) {
  //   return <Navigate to='/login' />;
  // }

  const actionChangeHandler = (event) => {
    setAction(event.target.value);
  };

  const entryChangeHandler = (event) => {
    setEntry(event.target.value);
  };

  const symbolChangeHandler = (event) => {
    setSymbol(event.target.value);
  };

  const priceChangeHandler = (event) => {
    setPrice(event.target.value);
    if (event.target.value !== null && event.target.value.trim() !== '') {
      setProfit(Math.floor(Math.random() * 201) - 100);
    } else {
      setProfit(0);
    }
  };

  const volumeChangeHandler = (event) => {
    setVolume(event.target.value);
  };

  const addDealHandler = async (event) => {
    event.preventDefault();
    if (!price || price === 0) {
      ctx.setOpenPopup(true);
      ctx.setPopupContent('Price needs to be set');
      return;
    }
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        Action: action,
        Entry: entry,
        Symbol: symbol,
        Price: price,
        Volume: volume,
        Profit: profit,
        Login: ctx.userID,
      }),
    };

    let token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : null;

    const headers = {
      'Content-type': 'application/json; charset=UTF-8',

      Authorization: `Bearer ${token}`,
    };

    requestOptions.headers = headers;

    ctx.setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/trades/`,
        requestOptions
      );
      const data = await response.json();
      if (response.status === 201) {
        fetchTrades(1);
        setAction(1);
        setEntry(0);
        setPrice(0);
        setProfit(0);
        setSymbol('EURUSD-');
        setVolume(0);
        return;
      }
      if (response.status === 400) {
        ctx.setIsLoading(false);
        alert(data.message);
        return;
      }
      if (response.status === 401) {
        ctx.setIsLoading(false);
        alert('Not Authorized to add!');
        return;
      }
    } catch (err) {
      ctx.setIsLoading(false);
      console.log(err);
    }
  };
  const dealFilterChangeHandler = (event) => {
    setDealFilter(event.target.value);
 
    // if (event.target.value === null || event.target.value.trim() === '') {
    //   fetchTrades(1);
    // }
  };

  const loginFilterChangeHandler = (event) => {
    setLoginFilter(event.target.value);
    // if (event.target.value === null || event.target.value.trim() === '') {
    //   fetchTrades(1);
    // }
  };

  const handlePageClick = (event) => {
    let queryParams = '';
    //Check if there is a deal filter
    if (dealFilter && dealFilter.trim() !== '' && dealFilter.trim() !== null) {
      // fetchTrades(1, `Deal=${dealFilter}`);
      queryParams+=`Deal=${dealFilter}`;
    }

    //Check if there is a login filter
    if(loginFilter && loginFilter.trim() !== '' && loginFilter.trim() !== null) {
   
    queryParams= queryParams==='' ? `Login=${loginFilter}` : queryParams+`&Login=${loginFilter}`;
    }

    if(queryParams!=='') {
      fetchTrades(event.selected +1, queryParams);
    }else {
    fetchTrades(event.selected + 1);
  }};

  const handleFilterClick = (event) => {
    event.preventDefault();
     
    let queryParams ='';
   
    //Check if there is a deal filter
    if (dealFilter && dealFilter.trim() !== '' && dealFilter.trim() !== null) {
      // fetchTrades(1, `Deal=${dealFilter}`);
      queryParams+=`Deal=${dealFilter}`;
    }

    //Check if there is a login filter
    if(loginFilter && loginFilter.trim() !== '' && loginFilter.trim() !== null) {
   
    queryParams= queryParams==='' ? `Login=${loginFilter}` : queryParams+`&Login=${loginFilter}`;
    }

    if(queryParams!=='') {
      fetchTrades(1, queryParams);
    } else {
      fetchTrades(1);
    }
  };
  return (
    <>
      <Navbar />
      <main className='home-main-wrapper'>
        <div className='add-and-search-forms-container'>
          {ctx.isAdmin === 0 && (
            <>
              <form className='add-form'>
                <label htmlFor='action'>Action</label>
                <select
                  name='action'
                  id='action'
                  onChange={actionChangeHandler}
                  defaultValue={action}
                >
                  <option value='1'>BUY</option>
                  <option value='0'>SELL</option>
                </select>
                <label htmlFor='entry'>Entry</label>
                <input
                  type='number'
                  id='entry'
                  name='entry'
                  onChange={entryChangeHandler}
                  value={entry}
                />
                <label htmlFor='symbol'>Symbol</label>
                <select
                  name='symbol'
                  id='symbol'
                  onChange={symbolChangeHandler}
                >
                  <option value='EURUSD-'>EURUSD-</option>
                  <option value='DAX30_Z18'>DAX30_Z18</option>
                  <option value='DJ18DEC'>DJ18DEC</option>
                </select>
                <label htmlFor='price'>Price</label>
                <input
                  type='number'
                  id='price'
                  name='price'
                  value={price}
                  onChange={priceChangeHandler}
                  required
                />
                <label htmlFor='volume'>Volume</label>
                <input
                  type='number'
                  id='volume'
                  name='volume'
                  onChange={volumeChangeHandler}
                  value={volume}
                />
                <label htmlFor='profit'>Profit</label>
                <input
                  type='number'
                  id='profit'
                  name='profit'
                  value={profit}
                  disabled
                  style={{
                    color:
                      profit > 0
                        ? 'green'
                        : profit < 0
                        ? 'red'
                        : 'var(--tertiary-color)',
                  }}
                />
                <button type='submit' onClick={addDealHandler}>
                  DEAL
                </button>
              </form>
            </>
          )}
          <form className='search-form'>
            <label htmlFor='deal'>{ctx.isAdmin===1 ? 'Filter trades by deal and/or login' : 'Filter trades by deal'}</label>
            <input
              id='deal'
              type='number'
              placeholder='Deals starting with ..'
              onChange={dealFilterChangeHandler}
            />
            {ctx.isAdmin === 1 && <>  <input
              id='login'
              type='number'
              placeholder='Logins starting with ..'
              onChange={loginFilterChangeHandler}
            /></>}
            <button type='submit' onClick={handleFilterClick}>
              FILTER
            </button>
          </form>
        </div>
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
            <tbody>
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
                            ? 'green'
                            : item.Profit < 0
                            ? 'red'
                            : 'var(--tertiary-color)',
                      }}
                    >
                      {item.Profit}
                    </td>
                    <td>{item.Volume}</td>
                  </tr>
                ))}
            </tbody>
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
            activeLink={currentPage}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
