import React from 'react';
import ArticleList from '../articles/ArticleList';

import SlideShow from '../../Component/common/Slideshow';

const DealerSignUp = () => {
  const slideshowImages = [
    require('../../images/admin/1.png'),
    require('../../images/admin/2.png'),
    require('../../images/admin/3.png')
  ];

  return (
    <>
    <SlideShow images={slideshowImages} />
    <ArticleList />
    </>
  );
}

export default DealerSignUp;