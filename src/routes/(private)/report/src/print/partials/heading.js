export default (doc, data, startY, fontSizes, lineSpacing) => {

    let startX = 57;
    const pageWidth = doc.internal.pageSize.width;
    const endX =  pageWidth - startX;

    doc.setFont(doc.vars.fontFamily, doc.vars.fontWeightBold);
    doc.setFontSize(fontSizes.SubTitleFontSize);

    // set fix value for Y to bring title in alignment with folding marks
    startY = 125;

    doc.text('Raport finansowy', startX, startY);

    doc.setFont(doc.vars.fontFamily, doc.vars.fontWeightNormal);
    doc.text('Wygenerowano 25.10.2023', endX, startY, 'right');

    startX = 57;

    doc.text('264 Chotomowska Drużyna Harcerzy', startX, startY += lineSpacing + 4);
    doc.text('"Żagiew" im. Stefana Krasińskiego', startX, startY += lineSpacing + 2);

    doc.setDrawColor(157, 183, 128);
    doc.setLineWidth(0.5);
    startY += lineSpacing;
    doc.line(startX, startY, endX, startY);

    return startY;
}
