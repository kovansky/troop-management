//import jsPDF from '../../node_modules/jspdf-yworks/dist/jspdf.debug';
import jsPDF from 'jspdf';
import addFontNormal from '../fonts/WorkSans-normal';
import addFontBold from '../fonts/WorkSans-bold';
import addressSender from './partials/addressSender';
import addressCustomer from './partials/addressCustomer';
import heading from './partials/heading';
import table from './partials/table';
import totals from './partials/totals';
import text from './partials/text';
import footer from './partials/footer';
import logo from './partials/logo';
import fetchSvg from './utils/fetchSvg';
import '../img/background.svg';

export default (printData) => {
    addFontNormal();
    addFontBold();

    const doc = new jsPDF('p', 'pt');
    doc.vars = {};
    doc.vars.fontFamily = 'WorkSans';
    doc.vars.fontWeightBold = 'bold';
    doc.vars.fontWeightNormal = 'normal';

    doc.setFont(doc.vars.fontFamily);

    // <><>><><>><>><><><><><>>><><<><><><><>
    // SETTINGS
    // <><>><><>><>><><><><><>>><><<><><><><>

    const fontSizes = {
        TitleFontSize:14,
        SubTitleFontSize:12,
        NormalFontSize:10,
        SmallFontSize:9
    };
    const lineSpacing = 12;

    let startY = 130; // bit more then 45mm

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const pageCenterX = pageWidth / 2;

    // <><>><><>><>><><><><><>>><><<><><><><>
    // COMPONENTS
    // <><>><><>><>><><><><><>>><><<><><><><>

    // <><>><><>><>><><><><><>>><><<><><><><>
    // Background init
    // need to print the background before other elements get printed on
    fetchSvg('../img/background.svg').then(async ({svg, width}) => {
        if (svg) {
            doc.setPage(1);

            doc.vars.bgImageWidth = width;
            doc.vars.bgImage = new XMLSerializer().serializeToString(svg);

            await doc.svg(svg, {
                x: pageCenterX - width / 2,
                y: 250
            });
        }

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Sender's address

        // startY = addressSender(doc, printData.addressSender, startY, fontSizes.NormalFontSize, lineSpacing);

        // const addressSvgLoaded = fetchSvg('img/address-bar.svg').then(({svg, width, height}) => {
        //     doc.setPage(1);

        //     const xOffset = 225;
		// 	const scale = 0.45; // scaling for finer details

        //     doc.svg(svg, {
        //         x: xOffset,
        //         y: 136,
		// 		width: width * scale,
		// 		height: height * scale
        //     });
        // });
        // // <><>><><>><>><><><><><>>><><<><><><><>
        // // Customer address

        // startY += 10;
        // startY = addressCustomer(doc, printData.address, startY, fontSizes.NormalFontSize, lineSpacing);

        // <><>><><>><>><><><><><>>><><<><><><><>
        // INVOICE DATA
        // <><>><><>><>><><><><><>>><><<><><><><>

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Invoicenumber, -date and subject

        startY = heading(doc, printData, startY, fontSizes, lineSpacing);

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Table with items

        startY = await table(doc, printData, startY, fontSizes.NormalFontSize, lineSpacing);

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Totals

        startY = await totals(doc, printData, startY, fontSizes.NormalFontSize, lineSpacing);

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Text

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Footer

        footer(doc, printData, fontSizes.SmallFontSize, lineSpacing);

        // <><>><><>><>><><><><><>>><><<><><><><>
        // REPEATED PAGE COMPONENTS
        // <><>><><>><>><><><><><>>><><<><><><><>

        const pageNr = doc.internal.getNumberOfPages();

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Fold Marks
        let n = 0;


        // <><>><><>><>><><><><><>>><><<><><><><>
        // Logo

        const logoLoaded = logo(doc, printData, pageNr);

        // <><>><><>><>><><><><><>>><><<><><><><>
        // Page Numbers

        if (pageNr > 1) {
            n = 0;
            doc.setFontSize(fontSizes.SmallFontSize);

            while (n < pageNr) {
                n++;

                doc.setPage(n);

                doc.text(n + ' / ' + pageNr, pageCenterX, pageHeight - 20, 'center');
            }
        }

        // <><>><><>><>><><><><><>>><><<><><><><>
        // PRINT
        // <><>><><>><>><><><><><>>><><<><><><><>

        Promise.all([logoLoaded]).then(() => {
            doc.output('dataurlnewwindow');
        });
    });
}
