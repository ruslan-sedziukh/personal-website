import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ModalContent = ({ children }: Props) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-300/50 p-4 pb-20">
      <div className="bg-neutral-50 h-[100%] p-4 rounded overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default ModalContent
