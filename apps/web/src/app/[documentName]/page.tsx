import path from 'path'
import { DOCUMENTS } from '../documents'
import { MD_DOCUMENTS_FOLDER, MD_DOCUMENTS_PATH } from '@/utils'
import { parseMarkdownFile } from '@ruslan-sedziukh/md-parser'
import { Markdown } from '@ruslan-sedziukh/md-render'

export default async function Page({
  params,
}: {
  params: Promise<{ documentName: string }>
}) {
  const documentName = (await params).documentName

  const document = DOCUMENTS.find((doc) => doc.name === documentName)

  if (!document?.name) {
    return <div>Not found</div>
  }

  const documentPath = path.join(
    MD_DOCUMENTS_PATH,
    documentName,
    `${documentName}.md`
  )

  const parsedMarkdown = parseMarkdownFile(documentPath, {
    assetsPrePath: path.join(MD_DOCUMENTS_FOLDER, documentName),
  })

  return (
    <div className="w-full flex flex-col gap-2">
      <Markdown parsedMarkdown={parsedMarkdown} />
    </div>
  )
}
