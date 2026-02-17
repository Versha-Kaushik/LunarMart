import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Image, Modal, Row, Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation, useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
  '/avatars/avatar7.png',
  '/avatars/avatar8.png',
];

const ProfileForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateProfile, { isLoading: isUpdateProfileLoading }] =
    useProfileMutation();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setMobile(userInfo.mobile || '');
      setAddress(userInfo.address || '');
      setCity(userInfo.city || '');
      setPostalCode(userInfo.postalCode || '');
      setCountry(userInfo.country || '');
      setImagePreview(userInfo.profileImage || '');
      setProfileImage(userInfo.profileImage || null);
    }
  }, [userInfo]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  const handleAvatarSelect = (avatarUrl) => {
    setImagePreview(avatarUrl);
    setProfileImage(avatarUrl);
    setShowAvatarModal(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const submitHandler = async e => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        return toast.error('Passwords do not match!');
      }
      const res = await updateProfile({ name, email, mobile, address, city, postalCode, country, password, profileImage }).unwrap();
      dispatch(setCredentials({ ...res }));
      setPassword('');
      setConfirmPassword('');
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Form onSubmit={submitHandler}>
        <div className="text-center mb-4">
          <div className="mb-3">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "3px solid #9333ea",
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  border: "2px dashed #d1d5db",
                }}
              >
                <FaCamera size={40} color="#9ca3af" />
              </div>
            )}
          </div>
          <Button
            variant="outline-primary"
            onClick={() => setShowAvatarModal(true)}
            style={{
              borderColor: "#9333ea",
              color: "#9333ea",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#9333ea";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#9333ea";
            }}
          >
            <FaCamera className="me-2" />
            Change Profile Picture
          </Button>
        </div>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            type='text'
            placeholder='Enter name'
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            type='email'
            placeholder='Enter email'
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='mobile'>
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            value={mobile}
            type='tel'
            placeholder='Enter mobile number'
            onChange={e => setMobile(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            value={address}
            type='text'
            placeholder='Enter address'
            onChange={e => setAddress(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className='mb-3' controlId='city'>
              <Form.Label>City</Form.Label>
              <Form.Control
                value={city}
                type='text'
                placeholder='Enter city'
                onChange={e => setCity(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className='mb-3' controlId='postalCode'>
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                value={postalCode}
                type='text'
                placeholder='Enter postal code'
                onChange={e => setPostalCode(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className='mb-3' controlId='country'>
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={country}
                type='text'
                placeholder='Enter country'
                onChange={e => setCountry(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder='Enter password'
              onChange={e => setPassword(e.target.value)}
            />
            <InputGroup.Text
              onClick={togglePasswordVisibility}
              id='togglePasswordVisibility'
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              placeholder='Confirm password'
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <InputGroup.Text
              onClick={toggleConfirmPasswordVisibility}
              id='toggleConfirmPasswordVisibility'
              style={{ cursor: 'pointer' }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Button
          className='mb-3 w-100'
          type='submit'
          style={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            border: 'none',
            padding: '12px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 8px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.25)';
          }}
        >
          Update Profile
        </Button>
        {isUpdateProfileLoading && <Loader />}
      </Form>

      <Modal
        show={showAvatarModal}
        onHide={() => setShowAvatarModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{ borderBottom: '2px solid #9333ea' }}>
          <Modal.Title style={{ color: '#9333ea', fontWeight: '700' }}>
            Choose Your Avatar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          <Row className="g-4">
            {avatars.map((avatar, index) => (
              <Col key={index} xs={6} sm={4} md={3}>
                <div
                  onClick={() => handleAvatarSelect(avatar)}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    padding: '10px',
                    borderRadius: '12px',
                    border: imagePreview === avatar ? '3px solid #9333ea' : '2px solid transparent',
                    backgroundColor: imagePreview === avatar ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (imagePreview !== avatar) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (imagePreview !== avatar) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Image
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '50%',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '2px solid #9333ea' }}>
          <Button
            variant="secondary"
            onClick={() => setShowAvatarModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileForm;
