import { useState, useCallback } from 'react';
import { extractTextFromFile } from '../utils/fileReader.js';

export const useFileExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);

  const extract = useCallback(async (file) => {
    setExtracting(true);
    setError(null);
    try {
      const text = await extractTextFromFile(file);
      return text;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setExtracting(false);
    }
  }, []);

  const extractMultiple = useCallback(async (files, onProgress) => {
    const results = [];
    for (const file of files) {
      try {
        onProgress?.({ file, status: 'extracting' });
        const text = await extractTextFromFile(file);
        results.push({ file, text, error: null });
        onProgress?.({ file, status: 'done', text });
      } catch (err) {
        results.push({ file, text: null, error: err.message });
        onProgress?.({ file, status: 'error', error: err.message });
      }
    }
    return results;
  }, []);

  return { extract, extractMultiple, extracting, error };
};
