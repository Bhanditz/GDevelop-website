import styled from 'styled-components';
import { media } from '../../lib/media';

const TransparentContainer = styled.div`
  width: 100%;
  min-height: 20px;

  padding-left: ${props => (props.noPadding ? '0' : '75px')};
  padding-right: ${props => (props.noPadding ? '0' : '75px')};
  display: block;

  ${media.tablet`
    padding-left: ${props => (props.noPadding ? '0' : '30px')};
    padding-right: ${props => (props.noPadding ? '0' : '30px')};
  `};
`;

export default TransparentContainer;
