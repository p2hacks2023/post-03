import { Interpolation, Theme, css } from "@emotion/react"
import { ReactNode } from "react"

const style = css`
  background-color: #E0E3E9;
  box-shadow: 4rem 4rem 4rem 0rem #A8ADB6, -4rem -4rem 4rem 0rem #FFF;
  border-radius: 20rem;
  padding: 20rem;
`;

type Props = {
  addCss?: Interpolation<Theme>,
  children: ReactNode,
}

export default function Card({addCss, children}: Props) {
  return <div css={[style, addCss]}>
    {children}
  </div>
}
