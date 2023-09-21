import { Link } from "react-router-dom";

import logoImg from "../../assets/logo.svg";

import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.container}>
      <div>
        <Link to="/">
          <img src={logoImg} alt="Logo Cripto" />
        </Link>
      </div>
    </header>
  );
}
