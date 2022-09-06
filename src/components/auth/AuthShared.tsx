import styled from 'styled-components/native';

export const TextInput = styled.TextInput`
  width: 100%;
  padding: 15px 7px;
  background-color: rgba(255, 255, 255, 0.15);
  margin-bottom: 8px;
  border-radius: 4px;
`;

export const CommentTextInput = styled(TextInput)`
  height: 100%;
  width: 90%;
  background-color: transparent;
  color: white;
`;
