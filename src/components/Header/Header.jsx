import Link from "next/link";
import styles from "./Header.module.scss";
import { CompanyLogo } from "../svgs";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.headerLogo}>
          <CompanyLogo />
        </Link>
        <div className={styles.headerAuth}>
          <span className={styles.headerAuthText}>
            Already have an account?
          </span>
          <Link href="/signin" className={styles.headerAuthLink}>
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
