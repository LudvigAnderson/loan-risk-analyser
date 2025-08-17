import type { ReactNode } from "react";

export interface TabViewProps {
  label: string;
  children: ReactNode;
}

const TabView = ({ children }: TabViewProps) => <>{children}</>;

export default TabView;