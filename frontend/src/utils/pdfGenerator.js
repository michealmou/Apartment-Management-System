import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportAnalyticsToPDF = async (elementId, filename = 'payment-analytics.pdf') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        // Create canvas from HTML element
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
        });

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add image to PDF, creating new pages as needed
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Add metadata
        pdf.setProperties({
            title: 'Payment Analytics Report',
            author: 'Apartment Management System',
            subject: 'Payment Analytics',
            creationDate: new Date(),
        });

        // Save PDF
        pdf.save(filename);

        return { success: true, message: 'PDF exported successfully' };
    } catch (error) {
        console.error('Error exporting PDF:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Generate detailed analytics PDF with tables
 */
export const exportDetailedAnalyticsToPDF = (statistics, chartData, filename = 'analytics-report.pdf') => {
    try {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        let yPosition = 20;

        // Title
        pdf.setFontSize(20);
        pdf.text('Payment Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Date generated
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Statistics Section
        pdf.setFontSize(14);
        pdf.text('Key Statistics', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        const statsData = [
            [`Total Due: $${statistics.totalDue.toFixed(2)}`],
            [`Total Collected: $${statistics.totalCollected.toFixed(2)}`],
            [`Outstanding: $${statistics.totalOutstanding.toFixed(2)}`],
            [`Collection Rate: ${statistics.collectionRate.toFixed(2)}%`],
        ];

        pdf.autoTable({
            body: statsData,
            startY: yPosition,
            theme: 'grid',
            margin: { left: 20, right: 20 },
        });

        yPosition = pdf.lastAutoTable.finalY + 15;

        // Status Breakdown
        if (chartData && chartData.length > 0) {
            pdf.setFontSize(14);
            pdf.text('Payment Status Breakdown', 20, yPosition);
            yPosition += 10;

            const statusData = chartData.map((item) => [
                item.name,
                item.value.toString(),
                `${item.percentage}%`,
            ]);

            pdf.autoTable({
                head: [['Status', 'Count', 'Percentage']],
                body: statusData,
                startY: yPosition,
                theme: 'grid',
                margin: { left: 20, right: 20 },
            });
        }

        pdf.save(filename);
        return { success: true, message: 'Detailed PDF exported successfully' };
    } catch (error) {
        console.error('Error exporting detailed PDF:', error);
        return { success: false, message: error.message };
    }
};
