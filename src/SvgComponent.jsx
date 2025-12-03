import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={112}
    height={112}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#fff"
        d="M32 54c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24Z"
      />
      <g clipPath="url(#b)">
        <path
          fill="#000"
          d="M68 66s-4.04-1.391-7.309-2.505H46.946C45.32 63.495 44 62.27 44 60.76V44.733C44 43.225 45.32 42 46.946 42h18.107C66.68 42 68 43.224 68 44.734v13.803L68 66Zm-3.548-8.986a.74.74 0 0 0-.236-.176.836.836 0 0 0-.605-.043.784.784 0 0 0-.266.14c-.026.02-2.584 2.01-7.346 2.01-4.702 0-7.3-1.977-7.346-2.013a.783.783 0 0 0-.266-.138.856.856 0 0 0-.604.044.737.737 0 0 0-.236.175.695.695 0 0 0-.188.53c.015.191.112.37.273.499.121.096 3.031 2.362 8.367 2.362 5.337 0 8.247-2.266 8.368-2.362a.71.71 0 0 0 .272-.498.695.695 0 0 0-.187-.53Z"
        />
      </g>
    </g>
    <defs>
      <clipPath id="b">
        <path fill="#fff" d="M44 42h24v24H44z" />
      </clipPath>
      <filter
        id="a"
        width={112}
        height={112}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={3} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2427_536"
        />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={16} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
        <feBlend
          in2="effect1_dropShadow_2427_536"
          result="effect2_dropShadow_2427_536"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect2_dropShadow_2427_536"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgComponent;
