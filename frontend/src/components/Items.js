import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Items(props) {
  const { item } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCart = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/items/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Item is out of stock');
      return;
    }
    ctxDispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/item/${item.slug}`}>
        <img src={item.image} className="card-img-top" alt={item.name} />
      </Link>
      <Card.Body>
        <Link to={`/item/${item.slug}`}>
          <Card.Title>{item.name}</Card.Title>
        </Link>
        <Rating rating={item.rating} reviewNum={item.reviewNum} />
        <Card.Text>RM {item.price}</Card.Text>
        {item.countInStock === 0 ? (
          <Button variant="light">Out of Stock</Button>
        ) : (
          <Button onClick={() => addToCart(item)} variant="primary">
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Items;
