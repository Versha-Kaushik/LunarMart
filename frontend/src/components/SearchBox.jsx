import {
  Form,
  InputGroup,
  Button
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { searchProduct } from '../slices/searchProductSlice';
import { FaSearch } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

function SearchBox({ searchTerm }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(searchProduct(value));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/');
    }
  };

  return (
    <Form className='d-flex' onSubmit={submitHandler}>
      <InputGroup style={{
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)'
      }}>
        <Form.Control
          size='sm'
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search decorations...'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            color: '#000000',
            fontSize: '0.95rem',
            paddingLeft: '12px'
          }}
        />
        <Button
          type='submit'
          variant='warning'
          style={{
            backgroundColor: '#34d399',
            border: 'none',
            color: '#0f172a',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaSearch size={14} />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBox;
