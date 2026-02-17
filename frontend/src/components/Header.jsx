import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Image, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaHome, FaLayerGroup, FaStore, FaUserPlus, FaSearch, FaChartLine, FaBox, FaBoxOpen, FaPlusCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const { searchTerm } = useSelector(state => state.search);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const isSellerRoute = location.pathname.startsWith('/seller');

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());

      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      navigate('/login');
      if (error?.status !== 401) {
        toast.info('Logged out locally');
      }
    }
  };

  return (
    <Navbar
      expand='md'
      collapseOnSelect
      variant='dark'
      className='fixed-top z-2'
      style={{
        background: '#0f172a',
        borderBottom: '4px solid #1e293b',
        boxShadow: '0 8px 32px rgba(8, 24, 252, 0.2)'
      }}
    >
      <Container fluid className="px-md-5">
        <LinkContainer to={isSellerRoute ? '/seller/home' : '/'}>
          <Navbar.Brand className='d-flex align-items-center gap-2' style={{
            fontWeight: '900',
            fontSize: '1.5rem',
            letterSpacing: '1px'
          }}>
            {!isSellerRoute ? (
              <>
                <img
                  src='/logo.png'
                  alt='LunarMart logo'
                  style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))' }}
                />
                <span style={{
                  color: '#F5F5DC',
                  textShadow: '0 0 15px rgba(245, 245, 220, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>LunarMart</span>
              </>
            ) : (
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                fontSize: '1.4rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                LunarMart Seller
              </span>
            )}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto m-2'>
            {showSearch && (
              <div className='d-flex align-items-center' style={{ minWidth: '200px', marginRight: '-8px' }}>
                <SearchBox searchTerm={searchTerm} />
              </div>
            )}
            {!isSellerRoute && (
              <Nav.Link
                onClick={() => setShowSearch(!showSearch)}
                style={{
                  color: '#ffffff',
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FaSearch />
              </Nav.Link>
            )}
            {isSellerRoute && userInfo && userInfo.isSeller && (
              <>
                <LinkContainer to='/seller/home'>
                  <Nav.Link style={{ color: '#ffffff', fontWeight: '800' }}>
                    <FaChartLine style={{ marginRight: '5px' }} /> Home
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/seller/products'>
                  <Nav.Link style={{ color: '#ffffff', fontWeight: '700' }}>
                    <FaBoxOpen style={{ marginRight: '5px' }} /> Product
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/seller/orders'>
                  <Nav.Link style={{ color: '#ffffff', fontWeight: '700' }}>
                    <FaBox style={{ marginRight: '5px' }} /> Order
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/seller/add-product'>
                  <Nav.Link style={{ color: '#ffffff', fontWeight: '700' }}>
                    <FaPlusCircle style={{ marginRight: '5px' }} /> Add Product
                  </Nav.Link>
                </LinkContainer>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '24px', margin: 'auto 15px' }} />
                <Nav.Link
                  onClick={logoutHandler}
                  style={{
                    color: '#ff6b6b',
                    fontWeight: '700',
                    transition: 'all 0.3s',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 107, 107, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaSignOutAlt style={{ marginRight: '5px' }} /> Logout
                </Nav.Link>
              </>
            )}
            {!isSellerRoute && (
              <>
                <LinkContainer to='/'>
                  <Nav.Link style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    transition: 'all 0.3s',
                    padding: '8px 16px',
                    borderRadius: '6px',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaHome style={{ marginRight: '5px' }} />
                    Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/categories'>
                  <Nav.Link style={{
                    color: '#ffffff',
                    fontWeight: '700',
                    transition: 'all 0.3s',
                    padding: '8px 16px',
                    borderRadius: '6px'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaLayerGroup style={{ marginRight: '5px' }} />
                    Decorations</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/cart'>
                  <Nav.Link style={{
                    color: '#ffffff',
                    fontWeight: '700',
                    transition: 'all 0.3s',
                    padding: '8px 16px',
                    borderRadius: '6px'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaShoppingCart style={{ marginRight: '5px' }} />
                    Cart
                    {cartItems.length > 0 && (
                      <Badge
                        pill
                        bg='warning'
                        style={{ marginLeft: '5px' }}
                        className='text-dark'
                      >
                        <strong>
                          {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                        </strong>
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                {!userInfo?.isSeller && (
                  <LinkContainer to='/become-seller'>
                    <Nav.Link style={{
                      color: '#ffffff',
                      fontWeight: '700',
                      transition: 'all 0.3s',
                      padding: '8px 16px',
                      borderRadius: '6px'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <FaStore style={{ marginRight: '5px' }} />
                      Become Seller
                    </Nav.Link>
                  </LinkContainer>
                )}
              </>
            )}
            {userInfo && !isSellerRoute ? (
              <>
                <LinkContainer to='/profile'>
                  <Nav.Link style={{
                    color: '#ffffff',
                    fontWeight: '700',
                    transition: 'all 0.3s',
                    padding: '8px 16px',
                    borderRadius: '6px'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {userInfo?.profileImage ? (
                      <img
                        src={userInfo.profileImage}
                        alt='Profile'
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '5px',
                          border: '2px solid #ffffff'
                        }}
                      />
                    ) : (
                      <img
                        src='/avatars/avatar8.png'
                        alt='Profile'
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '5px',
                          border: '2px solid rgba(255,255,255,0.5)'
                        }}
                      />
                    )}
                    Profile
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link
                  onClick={logoutHandler}
                  style={{
                    color: '#ff6b6b',
                    fontWeight: '700',
                    transition: 'all 0.3s',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 107, 107, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaSignOutAlt style={{ marginRight: '5px' }} />
                  Logout
                </Nav.Link>
              </>
            ) : !userInfo && (
              <>
                <LinkContainer to='/login'>
                  <Nav.Link style={{ color: '#ffffff', fontWeight: '700' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img src='/avatars/avatar8.png' alt='Login' style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '8px',
                      border: '1px solid rgba(255,255,255,0.5)'
                    }} />
                    Login
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to='/register'>
                  <Nav.Link style={{ color: '#ffffff', fontWeight: '700' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaUserPlus style={{ marginRight: '5px' }} />
                    Register
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
