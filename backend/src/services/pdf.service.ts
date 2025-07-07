import { Injectable } from '@nestjs/common';
import { PageService } from './page.service';
import { ChaletService } from './chalet.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  constructor(
    private pageService: PageService,
    private chaletService: ChaletService,
  ) {}

  async generateChaletQRCodesPdf(chaletId: string): Promise<Buffer> {
    const chalet = await this.chaletService.findOne(chaletId);
    if (!chalet) {
      throw new Error(`Chalet with ID ${chaletId} not found`);
    }
    const pages = await this.pageService.findByChaletId(chaletId);

    // Create HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>QR Codes - ${chalet.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            background: white;
          }
          h1 { 
            text-align: center; 
            color: #333;
            margin-bottom: 30px;
          }
          .qr-item { 
            page-break-inside: avoid;
            margin-bottom: 40px;
            text-align: center;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
          }
          .qr-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 10px;
            color: #333;
          }
          .qr-tags {
            font-size: 12px;
            color: #666;
            margin-bottom: 15px;
          }
          .qr-code { 
            display: block;
            margin: 0 auto;
            max-width: 200px;
          }
          .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>QR Codes - Chalet ${chalet.name}</h1>
        ${pages
          .map(
            (page) => `
          <div class="qr-item">
            <div class="qr-title">${page.title}</div>
            ${page.tags.length > 0 ? `<div class="qr-tags">Tags: ${page.tags.join(', ')}</div>` : ''}
            <img class="qr-code" src="${page.qrCodeUrl}" alt="QR Code for ${page.title}" />
          </div>
        `,
          )
          .join('')}
        <div class="footer">
          Généré le ${new Date().toLocaleDateString('fr-FR')} - Chalet ${chalet.name}
        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });
    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}
