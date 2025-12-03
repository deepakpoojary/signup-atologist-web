import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.headerLogo}>
          <Image
            src="/images/logo.svg"
            alt="Atologist Infotech"
            width={160}
            height={40}
            priority
          />
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
