import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { motion, easeInOut } from "motion/react"

import type { ReactNode } from "react";

import FormDisabledContext from "../../contexts/FormDisabledContext";

interface AccordionProps {
  buttonText: ReactNode;
  children: ReactNode;
  baseClassName?: string;
  closedClassName?: string;
  openClassName?: string;
  insideClassName?: string;
  paddingY?: number;
  useChevron?: boolean
}

export default function Accordion({ buttonText, children, baseClassName, closedClassName, openClassName, insideClassName, paddingY, useChevron=true }: AccordionProps) {
  const measurerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const paddingB = paddingY ?? 2;
  const paddingT = paddingY ?? 2;

  function handleOnClick() {
    setIsOpen(prev => !prev)
    if (measurerRef.current) {
      setHeight(measurerRef.current.scrollHeight + paddingB + paddingT);
    }
  }

  useEffect(() => {
    if (measurerRef.current) {
      setHeight(measurerRef.current.scrollHeight + paddingB + paddingT);
    }
  }, [children]);

  const baseButtonClass = baseClassName ?? "group flex items-center gap-2 !text-black cursor-pointer border border-transparent px-4 py-2 w-full";
  const closedButtonClass = closedClassName ?? "!bg-gray-100 hover:!bg-gray-300";
  const openButtonClass = openClassName ?? "!bg-gray-300 hover:!bg-gray-400";

  const insideContentClass= insideClassName ?? "px-5";


  return (
    <Disclosure>

      <DisclosureButton onClick={handleOnClick} className={baseButtonClass + " " + (isOpen ? openButtonClass : closedButtonClass)}>
        {buttonText}
        {useChevron && <ChevronDownIcon className="w-5 group-data-open:rotate-180" />}
      </DisclosureButton>
      <div className="overflow-hidden">

        <motion.div
            layout
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              height: isOpen ? `${height}px` : "0px",
              paddingTop: isOpen ? `${paddingT}px` : "0px",
              paddingBottom: isOpen ? `${paddingB}px` : "0px"
            }}
            transition={{ duration: 0.4, ease: easeInOut }}
            className="origin-top overflow-hidden"
          >
          <DisclosurePanel static className={insideContentClass}>
              {children}
          </DisclosurePanel>
        </motion.div>
  
        
      </div>
      <DisclosurePanel static className={"hidden-measurer " + insideContentClass} ref={measurerRef}>
          <FormDisabledContext.Provider value={true}>
            {children}
          </FormDisabledContext.Provider>
      </DisclosurePanel>

    </Disclosure>
  )
}