"use client";
import { MyNeeds } from "@/components/MyNeeds/MyNeeds";
import { useState } from "react";

import styles from "./PageRouter.module.css";

type NavItem = {
  tab: string;
  label: string;
  href: string;
  default?: boolean;
};

const Nav = ({
  nav,
  onSwitch,
  currentTab,
}: {
  nav: NavItem[];
  onSwitch: (navItem: NavItem) => void;
  currentTab?: NavItem;
}) => (
  <ul className={styles.nav}>
    {nav.map((item: NavItem) => {
      return (
        <li
          key={item.label}
          onClick={() => onSwitch(item)}
          className={currentTab?.tab === item.tab ? styles.active : ""}
        >
          {item.label}
        </li>
      );
    })}
  </ul>
);

export const PageRouter = () => {
  const nav: NavItem[] = [
    {
      tab: "needs",
      label: "Potrzeby",
      href: "/needs",
      default: true,
    },
    {
      tab: "projects",
      label: "Projekty",
      href: "/projects",
    },
  ];
  const defaultTab = nav.find((item) => item.default);
  const [currentTab, setCurrentTab] = useState<NavItem | undefined>(defaultTab);

  return (
    <div>
      <Nav nav={nav} onSwitch={setCurrentTab} currentTab={currentTab} />

      {currentTab?.tab === "needs" && <MyNeeds />}
    </div>
  );
};
