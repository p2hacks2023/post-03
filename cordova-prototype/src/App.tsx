import { useEffect, useState } from "react"
import { getLastSuicaRemainCredit, getLastSuicaUpdateDate } from "./plugins/nfc/src/BosomNfcPlugin";

export default function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    setInterval(async () => {
      setText(`${await getLastSuicaRemainCredit()} ${await getLastSuicaUpdateDate()}`);
    }, 1000);
  }, []);

  return <div>
    Credit: {text}
  </div>
}
