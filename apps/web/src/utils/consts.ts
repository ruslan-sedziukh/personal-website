import path from 'path'

/**
 * Path to folder with markdown documents.
 * It should be a folder inside `public` directory.
 *  */
export const MD_DOCUMENTS_FOLDER = 'md-documents'

export const MD_DOCUMENTS_PATH = path.join(
  process.cwd(),
  'public',
  MD_DOCUMENTS_FOLDER
)
