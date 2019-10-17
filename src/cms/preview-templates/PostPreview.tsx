import React from 'react';
import { PostTemplate } from '../../templates/post';

const PostPreview = ({entry, widgetFor}) => {
  const mockContext = {
    prev: undefined,
    next: undefined,
  };
  const mockRelatedPosts = {};
  const mockAuthor = {
    id: 'David Seybold',
    bio: 'I am awesome and great.',
    avatar: {},
  };
  const mockImage = {};
  return (
    <PostTemplate
        title={entry.getIn(['data', 'title'])}
        image={mockImage}
        date={widgetFor('date')}
        author={mockAuthor}
        tags={entry.getIn(['data', 'tags'])}
        userDate={widgetFor('date')}
        htmlAst={widgetFor('body')}
        relatedPosts={mockRelatedPosts}
        pageContext={mockContext}
      />
  );
};

export default PostPreview;