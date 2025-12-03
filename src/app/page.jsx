import Header from "@/components/Header/Header";
import SignupForm from "@/components/SignupForm/SignupForm";
import styles from "./page.module.scss";
import { Illustration, Popup } from "@/components/svgs";
export default function SignupPage() {
  return (
    <div className={styles.signupPage}>
      <Header />
      <main className={styles.signupMain}>
        <div className={styles.signupContainer}>
          <div className={styles.signupContent}>
            <div className={styles.signupFormSection}>
              <h1 className={styles.signupTitle}>
                Welcome To Atologist Infotech
              </h1>
              <p className={styles.signupSubtitle}>Create your account</p>
              <SignupForm />
            </div>
            <div className={styles.signupIllustration}>
              <Illustration />
            </div>
          </div>
        </div>
      </main>

      <ChatButton />
    </div>
  );
}
function ChatButton() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "62px",
        right: "62px",
        width: "60px",
        height: "60px",
        cursor: "pointer",
        zIndex: 9999,
      }}
    >
      <Popup />
    </div>
  );
}
