import { useState, FormEvent, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import style from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProps {
  data: CoinProps[];
}

export default function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [offset]);

  async function getData() {
    fetch(
      `https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=66b3c452dc043be00f4023395ff20a16e1f6375e4d8391e90ebe04fe026892b9`
    )
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });

        // console.log(formatedResult)
        const listCoins = [...coins, ...formatedResult];
        setCoins(listCoins);
      });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === "") {
      return;
    }
    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    if(offset === 0){
      setOffset(10)
      return;
    }

    setOffset(offset + 10)
  }

  return (
    <main className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... Ex bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={style.tr} key={item.id}>
                <td className={style.tdLabel} data-label="Moeda">
                  <div className={style.name}>
                    <img 
                        className={style.logo}
                        src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} 
                        alt="Logo Cripto" 
                    />
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={style.tdLabel} data-label="Valor Mercado">
                  {item.formatedMarket}
                </td>

                <td className={style.tdLabel} data-label="Preço">
                  {item.formatedPrice}
                </td>

                <td className={style.tdLabel} data-label="Volume">
                  {item.formatedVolume}
                </td>

                <td className={Number(item.changePercent24Hr) > 0 ? style.tdProfit : style.tdLose} data-label="Mudança 24h">
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={style.buttonMore} onClick={handleGetMore}>
        Carregar Mais
      </button>
    </main>
  );
}
