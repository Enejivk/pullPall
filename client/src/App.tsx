import { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Configure the worker
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

function PDFViewer({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [url]);

  return <canvas ref={canvasRef}></canvas>;
}


export default function App() {
  return (

    <div className="App">
      <h1>PDF Viewer</h1>
      <h1>dddddddddddddddddddddddddddddddd</h1>
      <PDFViewer url="https://doloreschatbucket.s3.us-east-2.amazonaws.com/lawyers/ghawkins/Intake+Forms/signed_ContractAgreement4.pdf" />
    </div>
  );
}