import  ActiveLink  from '../ActiveLink';
import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/Logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" prefetch activeClassName={styles.active} >
            <a>Post</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
