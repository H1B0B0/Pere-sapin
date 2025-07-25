"use server";
import { downloadChaletQRCodesPDF } from "@/lib/services/chalets";

type DownloadResult =
  | { success: true; data: string; filename: string; contentType: string }
  | { success: false; error: string };

export async function downloadQRCodesPDFAction(
  chaletId: string,
): Promise<DownloadResult> {
  try {
    const pdfBlob = await downloadChaletQRCodesPDF(chaletId);

    // Convert blob to base64 for client-side download
    const buffer = await pdfBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      success: true,
      data: base64,
      filename: `chalet-${chaletId}-qr-codes.pdf`,
      contentType: "application/pdf",
    };
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF:", error);

    return {
      success: false,
      error: "Erreur lors du téléchargement du PDF",
    };
  }
}
