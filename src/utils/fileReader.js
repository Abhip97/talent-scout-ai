const PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

let pdfjsLib = null;

const loadPdfjs = async () => {
  if (pdfjsLib) return pdfjsLib;
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  pdfjsLib = pdfjs;
  return pdfjsLib;
};

export const extractTextFromPDF = async (file) => {
  try {
    const lib = await loadPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      text += pageText + '\n';
    }
    return text.trim();
  } catch (err) {
    if (err.message && err.message.includes('password')) {
      throw new Error(`${file.name} is password-protected and cannot be read.`);
    }
    throw new Error(`Could not read ${file.name}. The file may be corrupted.`);
  }
};

export const extractTextFromDOCX = async (file) => {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch {
    throw new Error(`Could not read ${file.name}. The file may be corrupted.`);
  }
};

export const detectFileType = (file) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const mime = file.type.toLowerCase();
  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf';
  if (ext === 'docx' || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (ext === 'doc' || mime === 'application/msword') return 'doc';
  return 'unknown';
};

export const extractTextFromFile = async (file) => {
  const type = detectFileType(file);
  if (type === 'pdf') return extractTextFromPDF(file);
  if (type === 'docx') return extractTextFromDOCX(file);
  if (type === 'doc') throw new Error(`${file.name} is a .doc file. Please convert to .docx or .pdf.`);
  throw new Error(`${file.name} is not a supported file type. Please upload PDF or DOCX.`);
};
