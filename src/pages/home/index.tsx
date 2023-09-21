import { FormEvent, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { BiSearch } from "react-icons/bi";

import styles from "./home.module.css";

// https://sujeitoprogramador.com/api-cripto/?key=c4a9da5a77023a6e&pref=BRL

interface CoinProps {
  name: string;
  delta_24h: string;
  price: string;
  symbol: string;
  volume_24h: string;
  market_cap: string;
  formatedPrice: string;
  formatedMarket: string;
  numberDelta: number;
}

interface DataProps {
  coins: CoinProps[];
}

export function Home() {
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    function getData() {
      fetch(
        "https://sujeitoprogramador.com/api-cripto/?key=c4a9da5a77023a6e&pref=BRL"
      )
        .then((response) => response.json())
        .then((data: DataProps) => {
          let coinsData = data.coins.slice(0, 15);

          let price = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          const formatResult = coinsData.map((item) => {
            const formated = {
              ...item,
              formatedPrice: price.format(Number(item.price)),
              formatedMarket: price.format(Number(item.market_cap)),
              numberDelta: parseFloat(item.delta_24h.replace(",", ".")),
            };

            return formated;
          });

          setCoins(formatResult);
          setLoading(false);
        });
    }

    getData();
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    navigate(`/detail/${inputValue}`);
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <h4 className={styles.center}>Carregando informações...</h4>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input
          placeholder="Digite o simbolo da moeda: BTC..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">
          <BiSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.map((coin) => (
            <tr className={styles.tr} key={coin.name}>
              <td className={styles.tdLabel} data-label="Moeda">
                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                  <span>{coin.name}</span> | {coin.symbol}
                </Link>
              </td>
              <td className={styles.tdLabel} data-label="Mercado">
                {coin.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label="Preço">
                {coin.formatedPrice}
              </td>
              <td
                className={
                  coin.numberDelta >= 0 ? styles.tdProfit : styles.tdLoss
                }
                data-label="Volume"
              >
                <span>{coin.delta_24h}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
