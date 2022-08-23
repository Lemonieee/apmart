import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REQUEST':
      return { ...state, loadingCreate: true };
    case 'ADD_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'ADD_FAIL':
      return { ...state, loadingCreate: false };
    case 'UPLOAD_IMG_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_IMG_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_IMG_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function EditItemPage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  //need user info to authenticate the request for fetching item details from backend
  const { userInfo } = state;

  //extract the state, from the state extract loading and error
  //extract disptach to change the action
  const [{ loadingCreate, loadingUpload }, dispatch] = useReducer(reducer, {
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

  const update = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'ADD_REQUEST' });
      await axios.post(
        '/api/items',
        {
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
        type: 'ADD_SUCCESS',
      });
      toast.success('Item added successfully!');
      navigate('/admin/items');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'ADD_FAIL' });
    }
  };

  const uploadFile = async (e) => {
    //get file from the event
    const imgfile = e.target.files[0];
    const formData = new FormData();
    formData.append('file', imgfile);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      toast.success('Image uploaded successfully');
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  return (
    <div>
      <h2 style={{ display: 'flex', justifyContent: 'center' }}>Add Product</h2>
      <Container className="small-container">
        <Helmet>
          <title>Add Product</title>
        </Helmet>
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
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>Upload File</Form.Label>
              <Form.Control type="file" onChange={uploadFile} />
              {loadingUpload && <LoadingBox></LoadingBox>}
            </Form.Group>
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
            <Form.Label>Stock</Form.Label>
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
            <Button disabled={loadingCreate} type="submit">
              Create
            </Button>
            {loadingCreate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      </Container>
    </div>
  );
}
