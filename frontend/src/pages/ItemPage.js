//get lock from the URL and show it in the screen
//use hook from react-router-dom
//name of the hook use params

import { useParams } from 'react-router-dom';

function Product() {
  const params = useParams();
  const { slug } = params;
  return (
    <div>
      <h1>{slug}</h1>
    </div>
  );
}

export default Product;
