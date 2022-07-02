import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function EditItemPage() {
  const navigate = useNavigate();
  const params = useParams(); // /item/:id
  //rename id as itemId
  const { id: itemId } = params;

  const { state } = useContext(Store);
  //need user info to authenticate the request for fetching item details from backend
  const { userInfo } = state;

  //extract the state, from the state extract loading and error
  //extract disptach to change the action
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    //initial value
    loading: true,
    error: '',
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  //fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        //get ItemId from the URL using useParams
        const { data } = await axios.get(`/api/items/${itemId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setStock(data.stock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [itemId]);

  const update = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/items/${itemId}`,
        {
          _id: itemId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          stock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Item edited successfully!');
      navigate('/admin/items');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <div>
      <h2 style={{ display: 'flex', justifyContent: 'center' }}>
        Edit Product: {itemId}
      </h2>
      <Container className="small-container">
        <Helmet>
          <title>Edit Product ${itemId}</title>
        </Helmet>

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Form onSubmit={update}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <div
              className="mb-3"
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button disabled={loadingUpdate} type="submit">
                Update
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
        )}
      </Container>
    </div>
  );
}
