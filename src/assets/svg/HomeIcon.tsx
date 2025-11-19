import React from 'react';
import Svg, { G, Path, ClipPath, Defs, Rect } from 'react-native-svg';

type Props = {
  fill?: string;
  width?: number;
  height?: number;
};

const HomeIcon: React.FC<Props> = ({ fill = '#121712', width = 24, height = 32 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 32" fill="none" >
      <G clipPath="url(#clip0)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21 14.8328V23.5C21 24.3284 20.3284 25 19.5 25H15.75C14.9216 25 14.25 24.3284 14.25 23.5V19.75C14.25 19.3358 13.9142 19 13.5 19H10.5C10.0858 19 9.75 19.3358 9.75 19.75V23.5C9.75 24.3284 9.07843 25 8.25 25H4.5C3.67157 25 3 24.3284 3 23.5V14.8328C2.99994 14.4131 3.17573 14.0125 3.48469 13.7284L10.9847 6.65219L10.995 6.64188C11.5672 6.1215 12.4412 6.1215 13.0134 6.64188C13.0166 6.64554 13.0201 6.64899 13.0238 6.65219L20.5238 13.7284C20.8296 14.014 21.0022 14.4144 21 14.8328Z"
          fill={fill}
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect width="24" height="24" fill="white" transform="translate(0 4)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default HomeIcon;
