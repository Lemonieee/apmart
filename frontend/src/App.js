//use for navigation of web pages
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import CartPage from './pages/CartPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CheckoutPage from './pages/CheckoutPage';
import PayOptionPage from './pages/PayOptionPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import SearchResultPage from './pages/SearchResultPage';

import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import AdminRoute from './components/AdminRoute';
import ItemListPage from './pages/ItemListPage';
import AddItemPage from './pages/AddItemPage';
import EditItemPage from './pages/EditItemPage';
import OrderListPage from './pages/OrderListPage';
import UserListPage from './pages/UserListPage';
import EditUserPage from './pages/EditUserPage';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signOut = () => {
    contextDispatch({ type: 'SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('buyerDetails');
    localStorage.removeItem('paymentOption');
    localStorage.removeItem('cartItems');
    window.location.href = '/signin';
  };

  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchItemCategory = async () => {
      try {
        const { data } = await axios.get(`/api/items/categories`);
        setCategory(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchItemCategory();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sideBarOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
              <Button
                variant="blue"
                onClick={() => setSideBarOpen(!sideBarOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>APMart</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    <Button variant="blue">
                      <i
                        className="fas fa-shopping-cart"
                        style={{ color: '#FFFFFF' }}
                      ></i>
                    </Button>
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo && !userInfo.isAdmin ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/userprofile">
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
                    !userInfo && (
                      <Link className="nav-link" to="/signin">
                        <div style={{ paddingTop: '7px' }}>Sign In</div>
                      </Link>
                    )
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/items">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/userprofile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signOut}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sideBarOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-3">
            <Nav.Item>
              <h3>Category</h3>
            </Nav.Item>
            {category.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSideBarOpen(false)}
                >
                  <Nav.Link>
                    <h6 className="navLinkText">
                      {'>'}
                      {category}
                    </h6>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container>
            <Routes>
              <Route path="/item/:slug" element={<ItemsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/userprofile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchResultPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/placeorder"
                element={
                  <ProtectedRoute>
                    <PlaceOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/payment" element={<PayOptionPage />} />
              {/*Admin Route*/}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <EditUserPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/items"
                element={
                  <AdminRoute>
                    <ItemListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/item/add"
                element={
                  <AdminRoute>
                    <AddItemPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/item/:id"
                element={
                  <AdminRoute>
                    <EditItemPage />
                  </AdminRoute>
                }
              ></Route>
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
