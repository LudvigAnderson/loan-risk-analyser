import { Disclosure } from "@headlessui/react"
import TechStackModal from "./modals/TechStackModal"
import SkillsModal from "./modals/SkillsModal"

export default function Navbar() {
  return (

    <Disclosure as="div" className="relative container mx-auto px-4">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex space-x-4 pl-4">
          <TechStackModal />
          <SkillsModal />
        </div>
        <div className="pr-4">
          <a
            href="https://www.linkedin.com/in/ludvig-anderson/"
            target="_blank"
            className="btn !bg-blue-500 hover:!bg-blue-700"
          >LinkedIn</a>
          <a
            href="https://github.com/LudvigAnderson/loan-risk-analyser"
            target="_blank"
            className="btn !bg-black hover:!bg-gray-900 border-2 !border-gray-500"
          >GitHub repository</a>
        </div>
      </div>
    </Disclosure>

  )
}