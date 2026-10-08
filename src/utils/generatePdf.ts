import { jsPDF } from 'jspdf';
import { PLAYBOOKS, type PlaybookGoalKey } from '../data/playbooks.config';
import { trackEvent } from './sourceTracking';

export interface PdfOptions {
  goalKey?: PlaybookGoalKey;
  founderName?: string;
  projectIdea?: string;
}

export const downloadChecklistPdf = (options?: PdfOptions): void => {
  const goal: PlaybookGoalKey = options?.goalKey || 'new_app';
  const playbook = PLAYBOOKS[goal] || PLAYBOOKS.new_app;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    // 20mm reserved for bottom margin and clean footer clearance
    if (cursorY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      cursorY = margin;
      // Running header
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text('MVP SCOPING PLAYBOOK · NEDUNCHEZHIYAN', margin, cursorY);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, cursorY, { align: 'right' });
      cursorY += 6;
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 7;
    }
  };

  // Top Orange Accent Stripe
  doc.setFillColor(216, 76, 36); // #D84C24 Orange
  doc.rect(margin, cursorY, 28, 2, 'F');
  cursorY += 7;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(20, 20, 19); // #141413 Ink
  doc.text(playbook.title.toUpperCase(), margin, cursorY);
  cursorY += 6;

  // Disclaimer under title (Required by spec)
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(110, 110, 105);
  const disclaimerLines = doc.splitTextToSize(playbook.disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, cursorY);
  cursorY += disclaimerLines.length * 4.5 + 4;

  // Optional Founder / Project Card (ONLY IF PROVIDED - never print placeholder text)
  const cleanName = options?.founderName?.trim();
  const cleanIdea = options?.projectIdea?.trim();

  if (cleanName || cleanIdea) {
    doc.setFillColor(250, 248, 243); // Cream #FAF8F3
    doc.setDrawColor(225, 220, 210);
    doc.setLineWidth(0.3);

    const ideaLines = cleanIdea ? doc.splitTextToSize(`Project Scope: "${cleanIdea}"`, contentWidth - 10) : [];
    const cardHeight = 8 + (cleanName ? 5 : 0) + (ideaLines.length * 4);

    doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 2, 2, 'FD');

    let cardY = cursorY + 5;
    if (cleanName) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(216, 76, 36);
      doc.text(`PREPARED FOR: ${cleanName.toUpperCase()}`, margin + 5, cardY);
      cardY += 4.5;
    }

    if (ideaLines.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(ideaLines, margin + 5, cardY);
    }

    cursorY += cardHeight + 6;
  }

  // Thin separator
  doc.setDrawColor(230, 228, 222);
  doc.setLineWidth(0.3);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 6;

  // Checklist / Playbook Items
  playbook.items.forEach((item) => {
    const qLines = doc.splitTextToSize(`Question: ${item.question}`, contentWidth - 14);
    const ruleLines = item.rule ? doc.splitTextToSize(`Rule: ${item.rule}`, contentWidth - 14) : [];
    const trapLines = item.trap ? doc.splitTextToSize(`Trap: ${item.trap}`, contentWidth - 14) : [];
    const exLines = item.example ? doc.splitTextToSize(`Example: ${item.example}`, contentWidth - 14) : [];

    let totalItemHeight = 7 + (qLines.length * 4);
    if (ruleLines.length) totalItemHeight += (ruleLines.length * 3.7) + 1;
    if (trapLines.length) totalItemHeight += (trapLines.length * 3.7) + 1;
    if (exLines.length) totalItemHeight += (exLines.length * 3.7) + 1;
    totalItemHeight += 4;

    // Check page break for the whole item block to avoid breaks inside an item
    checkPageBreak(totalItemHeight);

    // Number Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(216, 76, 36);
    doc.text(`[ ${item.num} ]`, margin, cursorY);

    // Question
    doc.setTextColor(20, 20, 19);
    doc.text(qLines, margin + 14, cursorY);
    cursorY += qLines.length * 4 + 2;

    // Rule
    if (ruleLines.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text(ruleLines, margin + 14, cursorY);
      cursorY += ruleLines.length * 3.7 + 1.5;
    }

    // Trap
    if (trapLines.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(170, 50, 30);
      doc.text(trapLines, margin + 14, cursorY);
      cursorY += trapLines.length * 3.7 + 1.5;
    }

    // Example
    if (exLines.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(90, 90, 90);
      doc.text(exLines, margin + 14, cursorY);
      cursorY += exLines.length * 3.7 + 2.5;
    }

    // Subtle line between items
    cursorY += 2;
    doc.setDrawColor(242, 240, 235);
    doc.setLineWidth(0.2);
    doc.line(margin + 14, cursorY, pageWidth - margin, cursorY);
    cursorY += 4;
  });

  // Footer (Shows name, "Full-Stack Developer & Product Engineer", and portfolio URL only. No email)
  checkPageBreak(12);
  cursorY += 3;
  doc.setDrawColor(216, 76, 36);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text('Nedunchezhiyan · Full-Stack Developer & Product Engineer', margin, cursorY);
  doc.text('https://nedunchezhiyan.dev', pageWidth - margin, cursorY, { align: 'right' });

  // Save the PDF directly to downloads
  const sanitizedName = cleanName ? cleanName.replace(/[^a-zA-Z0-9]/g, '_') : '';
  const filename = sanitizedName
    ? `MVP-Scoping-Playbook-${sanitizedName}.pdf`
    : `MVP-Scoping-Playbook-${goal}.pdf`;

  doc.save(filename);

  // Track event
  trackEvent({ event: 'playbook_download', goal });
};
