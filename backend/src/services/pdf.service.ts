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
            margin: 10px;
            background: white;
            line-height: 1.2;
          }
          h1 { 
            text-align: center; 
            color: #333;
            margin-bottom: 20px;
            font-size: 20px;
          }
          .qr-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            gap: 20px;
            margin-bottom: 20px;
          }
          .qr-item { 
            page-break-inside: avoid;
            text-align: center;
            border: 2px solid #333;
            padding: 15px;
            border-radius: 10px;
            width: 240px;
            box-sizing: border-box;
            background: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .chalet-name {
            font-size: 11px;
            color: #888;
            margin-bottom: 3px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .qr-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 10px;
            color: #000;
            line-height: 1.2;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .qr-tags {
            font-size: 11px;
            color: #555;
            margin-bottom: 15px;
            line-height: 1.2;
            font-weight: 500;
          }
          .qr-code { 
            display: block;
            margin: 0 auto 10px auto;
            width: 180px;
            height: 180px;
            border: 1px solid #eee;
          }
          .cut-lines {
            border: 1px dashed #ccc;
            position: absolute;
            pointer-events: none;
          }
          .footer {
            position: fixed;
            bottom: 15px;
            left: 15px;
            right: 15px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>QR Codes - Chalet ${chalet.name}</h1>
        <div class="qr-container">
        ${pages
          .map(
            (page) => `
            <div class="qr-item">
              <div class="qr-title">${page.title}</div>
              ${page.tags.length > 0 ? `<div class="qr-tags">${page.tags.join(', ')}</div>` : ''}
              <img class="qr-code" src="${page.qrCodeUrl}" alt="QR Code for ${page.title}" />
            </div>
          `,
          )
          .join('')}
        </div>
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
