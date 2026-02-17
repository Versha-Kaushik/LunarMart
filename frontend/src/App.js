import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';

const App = () => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');

  return (
    <div className='position-relative'>
      <Header />
      <main className='pt-5 mt-5'>
        <Container fluid className={isSellerRoute ? "p-0" : "px-md-5"}>
          <Outlet />
        </Container>
      </main>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default App;
