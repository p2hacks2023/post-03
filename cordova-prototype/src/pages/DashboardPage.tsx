import useBalanceValue from "../features/balance/useBalanceValue";
import Circle from "../assets/dashboard/circle.png";

export default function DashboardPage() {
  const { data: balanceData, isLoading: _ } = useBalanceValue();
  return (
    <>
      <div
        css={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <img
          css={{
            position: "absolute",
            objectFit: "contain",
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
          src={Circle}
        />
        <div css={{ textAlign: "center", zIndex: 1 }}>
          <div>
            <div css={{ fontSize: "15pt" }}>残高</div>
            <div css={{ fontSize: "30pt", fontWeight: 700, color: "#4F6AFA" }}>{balanceData?.balance}円</div>
          </div>
          <div css={{marginTop: "15pt"}}>
            <div css={{ fontSize: "15pt" }}>懐温</div>
            <div css={{ fontSize: "30pt", fontWeight: 700, color: "#4F6AFA" }}>22℃</div>
          </div>
        </div>
      </div>
    </>
  );
}

