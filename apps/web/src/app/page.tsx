import { redirect } from 'next/navigation'
import { DOCUMENTS } from './documents'

const Page = () => {
  if (!DOCUMENTS.length) {
    return <div>There are no documents yet.</div>
  }

  redirect(DOCUMENTS[0].name)
}

export default Page
