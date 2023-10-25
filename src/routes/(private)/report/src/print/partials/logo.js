import logo from '$lib/assets/logo.png'
export default (doc, printData, pageNr) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageCenterX = pageWidth / 2;
    let n = 0;


    while (n < pageNr) {
        n++;
        try {
            doc.setPage(n);

            doc.addImage(logo, "PNG", pageCenterX - 50, 25, 100, 100);
    
            doc.link(pageCenterX - 50, 25, 100, 100, {
                url: printData.personalInfo.website
            });
            
        } catch (error) {
            console.log(error);
        }

       

    }
}
