import React from 'react';
import styled from 'styled-components/native';

interface PhotoImageProps {
  file: string;
}
const PhotoContainer = styled.View`
  width: 100%;
  height: 400px;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 400px;
  align-self: center;
`;

const PhotoImage = ({file}: PhotoImageProps) => {
  return (
    <PhotoContainer>
      <PostImage resizeMode="cover" source={{uri: file}} />
    </PhotoContainer>
  );
};

export default React.memo(PhotoImage);
