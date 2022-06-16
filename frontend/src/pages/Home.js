import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Items from '../components/Items';

// useState [variable, func to update the variable]
// useEffect accepts 2 params:
// first: function second: array
// empty array because gonna run the function inside use effect only one time after rendering the component
// useEffect to call API and get product from backend

/*first param: state
  second param:  action that change the state and create new state
  compare three type of action  */

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      /*keep previous state and only update loading to true to show a loading box in UI*/
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      /*keep previous state and only update product coming from the action, payload contains all prod from backend
       loading to false */
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Home() {
  /*use dispatch to dispatch to call an action and update state*/
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Featured Products</h1>

      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Items product={product}></Items>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Home;
