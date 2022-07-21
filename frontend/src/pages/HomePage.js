import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Items from '../components/Items';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

/*first param: current state
  second param:  action that change the state and create new state
  compare three type of action  */

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      /*keep previous state and only update loading to true to show a loading box in UI*/
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      /*keep previous state and only update item coming from the action, payload contains all prod from backend
       loading to false */
      return { ...state, items: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Home() {
  /*use dispatch to dispatch to call an action and update state*/
  const [{ loading, error, items }, dispatch] = useReducer(logger(reducer), {
    items: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/items');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>APMart</title>
      </Helmet>
      <h1>Featured items</h1>

      <div className="items">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {items.map((item) => (
              <Col key={item.slug} sm={6} md={4} lg={3} className="mb-3">
                <Items item={item}></Items>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Home;
