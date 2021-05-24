import React from 'react';
import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/Logo.svg" alt="ig.news" />
        <nav>
          <a className={styles.active} href="">
            Home
          </a>
          <a href="">Post</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
