import React, { useState, type ReactNode, type ReactElement } from "react"
import Button from "./Button";

import type { TabViewProps } from "./TabView";

interface TabsContainerProps {
  children: ReactNode
}

export default function TabsContainer({ children }: TabsContainerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Only accept TabViews
  const childrenArray = React.Children.toArray(children).filter(
    (child): child is ReactElement<TabViewProps> =>
      React.isValidElement<TabViewProps>(child) && child.props.label !== undefined
  );

  return (
    <div>
      <div>
        {childrenArray.map((child, index) => (
          <Button
            key={index}
            className={(index == activeIndex) ? "btn !bg-indigo-800" : "btn"}
            onClick={() => setActiveIndex(index)}
          >{child.props.label}</Button>
        ))}
      </div>
      <div>{childrenArray[activeIndex]}</div>
    </div>
  )
}