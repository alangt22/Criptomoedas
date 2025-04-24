import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoinProps } from "../home";
import style from "./detail.module.css";

interface ResponseData {
  data: CoinProps;
}

interface ErrorProps {
  error: string;
}

type DataProps = ResponseData | ErrorProps;

export default function Detail() {
  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);
  const { cripto } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(
          `https://rest.coincap.io/v3/assets/${cripto}?apiKey=66b3c452dc043be00f4023395ff20a16e1f6375e4d8391e90ebe04fe026892b9`
        )
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    getCoin();
  }, [cripto]);

  if(loading || !coin){    
    return (
      <div className={style.container}>
        <h4 className={style.center}>Carregando Detalhes...</h4>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <h1 className={style.center}>{coin?.name}</h1>
      <h1 className={style.center}>{coin?.symbol}</h1>

      <section className={style.content}>
        <img 
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} 
          alt="Logo da moeda"
          className={style.logo} 
        />
        <h1>{coin?.name} | {coin?.symbol}</h1>

        <p><strong>Preço: </strong>{coin?.formatedPrice}</p>
        <a>
          <strong>Mercado: </strong>{coin?.formatedMarket}
        </a>
        <a>
          <strong>Volume: </strong>{coin?.formatedVolume}
        </a>
        <a>
          <strong>Mudança 24h: </strong>
          <span 
            className={Number(coin?.changePercent24Hr) > 0 ? style.tdProfit : style.tdLoss}>
            {Number(coin?.changePercent24Hr).toFixed(3)}</span>
        </a>
      </section>

    </div>
  );
}
