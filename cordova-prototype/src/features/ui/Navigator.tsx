import { css } from "@emotion/react";
import { Link, useLocation } from "react-router-dom";
import ConfigNavigation from "../../assets/navigation/config.png";
import DashboardNavigation from "../../assets/navigation/dashboard.png";

const navigator = css`
  position: relative;
  width: 100%;
  aspect-ratio: 750/88;
`;

const navigation = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export default function Navigator() {
  const location = useLocation();

  return <div css={navigator}>
    {
      location.pathname.startsWith("/config") ? <img css={navigation} src={ConfigNavigation} alt="" /> : <img css={navigation} src={DashboardNavigation} alt="" />
    }
    <Link css={{position: "absolute", left: 0, right: "50%", top: 0, bottom: 0}} to="/"></Link>
    <Link css={{position: "absolute", left: "50%", right: 0, top: 0, bottom: 0}} to="/config"></Link>
  </div>
}
