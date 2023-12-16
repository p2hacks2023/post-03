import { Interpolation, Theme, css } from "@emotion/react";
import { Children, ReactNode } from "react";

type Props = {
  children: ReactNode
  addCss?: Interpolation<Theme>,
  onClick: () => void,
}

const button = css`
  box-shadow:
    4rem 4rem 4rem 0rem #a8adb6,
    -4rem -4rem 4rem 0rem #fff;
  border: none;
  background-color: transparent;
  font-size: 12rem;
  line-height: 16rem;
  padding: 8rem 24rem;
  border-radius: 999rem;
  color: #5F6877;
`;

export default function Button({addCss, children, onClick}: Props) {
  return <button css={[button, addCss]} onClick={onClick}>
    {children}
  </button>;
}
