import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Items(props) {
  const { item } = props;
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
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}
export default Items;
