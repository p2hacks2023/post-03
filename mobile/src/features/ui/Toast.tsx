import { css } from "@emotion/react";
import { Toast, resolveValue } from "react-hot-toast";

type Props = {
  toast: Toast;
};

export default function CustomToast({ toast }: Props) {
  return (
    <div css={[button]} style={{backgroundColor: "#4F6AFA"}}>
      {resolveValue(toast.message, toast)}
    </div>
  );
}

const button = css`
  border: none;
  font-size: 12rem;
  line-height: 16rem;
  padding: 8rem 24rem;
  border-radius: 999rem;
  box-shadow: 0 12rem 20rem 0 rgba(0, 0, 0, 0.25);
  color: #fff;
`;
