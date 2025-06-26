import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-final-report',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './final-report.component.html',
  styleUrl: './final-report.component.css'
})
export class FinalReportComponent {

    downloadPDF(): void {
    const element = document.getElementById('pdfContent');
    if (!element) {
      console.error('Element not found!');
      return;
    }

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 190; // Fit to A4 width (210mm with margins)
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height accordingly

      let yPosition = 10;
      let pageCanvasHeight = pageHeight - 20; // Leave some margin
      let remainingHeight = imgHeight;

      let startY = 0; // Start position for cropping
      let page = 0;

      while (remainingHeight > 0) {
        let cropHeight = Math.min(remainingHeight, pageCanvasHeight);

        // Create a new canvas to hold the cropped section
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = (cropHeight * canvas.width) / imgWidth;

        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0,
            startY, // Start position in original canvas
            canvas.width,
            pageCanvas.height, // Crop height in original canvas
            0,
            0,
            pageCanvas.width,
            pageCanvas.height
          );

          const pageImgData = pageCanvas.toDataURL('image/png');

          if (page > 0) pdf.addPage(); // Add a new page after the first one
          pdf.addImage(pageImgData, 'PNG', 10, yPosition, imgWidth, cropHeight);

          startY += pageCanvas.height;
          remainingHeight -= cropHeight;
          page++;
        }
      }
      pdf.save('case-report.pdf');
    });
  }
  
}
