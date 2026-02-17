import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPalette, FaLayerGroup, FaLightbulb, FaCube, FaGem, FaImage, FaArrowRight } from 'react-icons/fa';
import Meta from '../components/Meta';

const categories = [
  {
    id: 'wall-art',
    name: 'Wall Art',
    icon: FaPalette,
    color: '#38bdf8',
    description: 'Beautiful wall decorations and artwork',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vases',
    name: 'Vases',
    icon: FaCube,
    color: '#7c3aed',
    description: 'Elegant handcrafted ceramic and glass vases',
    image: 'https://media.istockphoto.com/id/2217238489/photo/minimal-bedroom-interior-decor-with-fresh-pink-peony-flowers-in-a-white-ceramic-vase-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=rhZIAThLHtMMeeQN41hOJb-_7eLtYbOopCBTC8IAlKs='
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: FaLightbulb,
    color: '#f59e0b',
    description: 'Ambient lighting solutions',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mirrors',
    name: 'Mirrors',
    icon: FaGem,
    color: '#10b981',
    description: 'Decorative mirrors',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wallpaper',
    name: 'Wallpaper',
    icon: FaImage,
    color: '#ec4899',
    description: 'Stunning wall patterns and textures',
    image: 'https://images.unsplash.com/photo-1770387795112-e2b476b15f71?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'scented-candles',
    name: 'Scented Candles',
    icon: FaLayerGroup,
    color: '#f43f5e',
    description: 'Premium aromatic candles for home ambiance',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
  }
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    navigate(`/categories/${id}`);
  };

  return (
    <>
      <Meta title='Categories' />
      <div className='mb-5 mt-4 text-center'>
        <h1 style={{
          color: '#ffffff',
          fontWeight: '900',
          fontSize: '3rem',
          textShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
          marginBottom: '1rem'
        }}>
          Explore Our Collections
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Discover curated decorations to transform your living spaces into masterpieces.
        </p>
      </div>

      <Row className='g-4' style={{ marginBottom: '80px' }}>
        {categories.map(cat => {
          const IconComponent = cat.icon;
          return (
            <Col key={cat.id} sm={12} md={6} lg={4}>
              <Card
                className='category-card h-100'
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '400px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  background: '#0f172a'
                }}
              >

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.8s ease',
                  zIndex: 0
                }} className="card-bg-image" />

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.9) 100%)`,
                  zIndex: 1,
                  transition: 'opacity 0.3s ease'
                }} />

                <div style={{
                  position: 'absolute',
                  bottom: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: cat.color,
                  filter: 'blur(100px)',
                  opacity: '0.2',
                  zIndex: 1,
                  transition: 'opacity 0.5s ease'
                }} className="color-glow" />

                <Card.Body className='d-flex flex-column justify-content-end position-relative' style={{ zIndex: 2, padding: '2.5rem' }}>
                  <div className="mb-3 d-flex align-items-center gap-3">
                    <div style={{
                      background: `${cat.color}20`,
                      padding: '12px',
                      borderRadius: '12px',
                      border: `1px solid ${cat.color}40`,
                      color: cat.color,
                      backdropFilter: 'blur(8px)'
                    }}>
                      <IconComponent size={24} />
                    </div>
                  </div>

                  <Card.Title style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1.75rem',
                    marginBottom: '0.75rem',
                    letterSpacing: '0.5px'
                  }}>
                    {cat.name}
                  </Card.Title>

                  <Card.Text style={{
                    color: '#cbd5e1',
                    fontSize: '1rem',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    {cat.description}
                  </Card.Text>

                  <div className="d-flex align-items-center gap-2 group" style={{ color: cat.color, fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    View Collection
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <style>{`
        .category-card:hover .card-bg-image {
          transform: scale(1.1);
        }
        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .category-card:hover .color-glow {
          opacity: 0.4;
        }
      `}</style>
    </>
  );
};

export default CategoriesPage;
