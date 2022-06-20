import { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Store } from '../Store';

function Items(props) {
  const { item } = props;
  const { state, dispatch: contextDispatch } = useContext(Store);

  const addToCart = () => {
    contextDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity: 1 },
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
        <Card.Text>${item.price}</Card.Text>
        <Button onClick={addToCart} variant="primary">
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
export default Items;
