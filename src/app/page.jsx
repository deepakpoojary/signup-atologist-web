import Header from '@/components/Header/Header'
import SignupForm from '@/components/SignupForm/SignupForm'
import Image from 'next/image'
import styles from './page.module.scss'

export default function SignupPage() {
  return (
    <div className={styles.signupPage}>
      <Header />
      <main className={styles.signupMain}>
        <div className={styles.signupContainer}>
          <div className={styles.signupContent}>
            <div className={styles.signupFormSection}>
              <h1 className={styles.signupTitle}>Welcome To Atologist Infotech</h1>
              <p className={styles.signupSubtitle}>Create your account</p>
              <SignupForm />
            </div>
            <div className={styles.signupIllustration}>
              <Image 
                src="/images/illustration.svg"
                alt="Robot and person interacting with digital interface"
                width={450}
                height={400}
                priority
              />
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  )
}

function ChatWidget() {
  return (
    <button className={styles.chatWidget} aria-label="Open chat">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" 
          fill="white"
        />
      </svg>
    </button>
  )
}

