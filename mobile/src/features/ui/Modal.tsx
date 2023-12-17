import { css } from "@emotion/react";
import { ReactNode, useEffect, useState } from "react";
import usePortal from "../../utils/usePortal";

const modalContainer = css`
  position: fixed;
  display: flex;
  justify-content: stretch;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rem;
`;

const modal = css`
  flex: 1;
  padding: 16rem;
  background-color: #fff;
  border-radius: 20rem;
  background: #fff;
  box-shadow: 0px 12rem 20rem 0 rgba(0, 0, 0, 0.25);
`;

const touchGuard = css`
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: () => ReactNode;
};

export default function Modal({ isOpen, onClose, children }: Props) {
  const [shouldPreserve, setShouldPreserve] = useState<boolean>();

  useEffect(() => {
    if (isOpen) {
      setShouldPreserve(true);
    }

    const timeout = setTimeout(() => {
      setShouldPreserve(false);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  const portal = usePortal();

  if (!isOpen && !shouldPreserve) {
    return null;
  }

  return portal(
    <div css={modalContainer}>
      <div css={touchGuard} onClick={onClose} />
      <div css={modal}>{children()}</div>
    </div>,
  );
}
