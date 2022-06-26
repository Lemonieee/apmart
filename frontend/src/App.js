//use for navigation of web pages
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import CartPage from './pages/CartPage';
import SignInPage from './pages/SignInPage';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signOut = () => {
    contextDispatch({ type: 'SIGNOUT' });
    localStorage.removeItem('userInfo');
  };

  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="primary" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>APMart</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signOut}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/item/:slug" element={<ItemsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;
