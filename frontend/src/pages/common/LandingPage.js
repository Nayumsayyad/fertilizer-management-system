import React from 'react';
import ArticleList from '../Nilupul/ArticleList';

import SlideShow from '../../Component/common/Slideshow';

const DealerSignUp = () => {
  const slideshowImages = [
    require('../../images/Rahul/1.png'),
    require('../../images/Rahul/2.png'),
    require('../../images/Rahul/3.png')
  ];

  return (
    <>
    <SlideShow images={slideshowImages} />
    <ArticleList />
    </>
  );
}

export default DealerSignUp;