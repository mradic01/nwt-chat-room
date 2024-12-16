import React from "react";
import styles from "./Header.module.css";

const Header = ({ room, userCount }) => (
  <div className={styles.Header}>
    <h4>{room}</h4>
    <span>{userCount} user(s) online</span>
  </div>
);

export default Header;
