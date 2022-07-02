import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

//manage state of fetching products from backend
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        items: action.payload.items,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_REQUEST':
      return { ...state, loadingCreate: true };
    case 'ADD_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'ADD_FAIL':
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

export default function ItemListPage() {
  const [{ loading, error, items, pages, loadingCreate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        //send ajax request
        const { data } = await axios.get(`/api/items/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, [page, userInfo]);

  const addNewItem = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'ADD_REQUEST' });
        const { data } = await axios.post(
          '/api/items',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Item created successfully');
        dispatch({ type: 'ADD_SUCCESS' });
        navigate(`/admin/item/${data.item._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'ADD_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Items</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={addNewItem}>
              Add New Item
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {items.map((items) => (
                <tr key={items._id}>
                  <td>{items._id}</td>
                  <td>{items.name}</td>
                  <td>{items.price}</td>
                  <td>{items.category}</td>
                  <td>{items.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {/*Array from javascript, pass the pages as param, call the keys on it 
                returns an array from 0 to pages - 1 and use map function to convert it to a link*/}
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/items?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
