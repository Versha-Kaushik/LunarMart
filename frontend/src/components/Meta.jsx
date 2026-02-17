import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <link rel='icon' href='/logo.png' />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'LunarMart',
  description:
    'Browse and buy the latest decorative items on our online store. Find great deals on decorative items. Fast shipping and secure payments.',
  keywords:
    'decorative items, online shopping, decorative accessories'
};

export default Meta;
