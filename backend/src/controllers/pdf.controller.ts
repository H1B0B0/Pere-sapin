import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from '../services/pdf.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('chalet/:chaletId/qr-codes')
  @UseGuards(JwtAuthGuard)
  async downloadChaletQRCodesPdf(
    @Param('chaletId') chaletId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.pdfService.generateChaletQRCodesPdf(chaletId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="qr-codes-chalet-${chaletId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
