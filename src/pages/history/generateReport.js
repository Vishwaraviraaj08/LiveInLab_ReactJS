import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import PDFDocument from 'pdfkit-browserify';

// const API_KEY = "AIzaSyAafzAvzz0We5pbSlo2xCw8tBB-GsAovq4";
const API_KEY = "AIzaSyD9PUORJgf-h09mSnWX7RHkPJ5Mk2WuV0c";

export async function generateText(data, model = "gemini-pro") {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelInstance = genAI.getGenerativeModel({ model });

    const prompt = createPrompt(data);

    try {
        const result = await modelInstance.generateContent(prompt);
        const response = await result.response;
        const markdownAnalysis = response.text();
        const plainTextAnalysis = stripMarkdown(markdownAnalysis);

        generatePDF(data, plainTextAnalysis);
    } catch (error) {
        console.error(error);
        return "Error generating text.";
    }
}

function createPrompt(data) {
    return `
    Please provide a detailed analysis and feedback report based on the following dance performance data:

    Overall Match: ${data.overAllMatch}
    Right-Upper-Arm: ${data['Right-Upper-Arm']}
    Right-Lower-Arm: ${data['Right-Lower-Arm']}
    Shoulder: ${data['Shoulder']}
    Left-Upper-Arm: ${data['Left-Upper-Arm']}
    Left-Lower-Arm: ${data['Left-Lower-Arm']}
    Right-Lumbar: ${data['Right-Lumbar']}
    Left-Lumbar: ${data['Left-Lumbar']}
    Abdomen: ${data['Abdomen']}
    Right-Thigh: ${data['Right-Thigh']}
    Right-Cough: ${data['Right-Cough']}
    Left-Thigh: ${data['Left-Thigh']}
    Left-Cough: ${data['Left-Cough']}


    Include very big and detailed feedback for each section and suggestions for improvement. The report should also comment on the overall performance.
  `;
}

function stripMarkdown(markdown) {
    // Convert markdown to HTML
    const html = marked(markdown);
    // Remove HTML tags to get plain text
    return html.replace(/<\/?[^>]+(>|$)/g, "");
}

function generatePDF(data, analysis) {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
        const blob = new Blob(chunks, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dance_analysis_report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the URL object
    });

    doc.fontSize(16).text('Dance Performance Analysis Report', { align: 'center' });
    doc.fontSize(16).text(data.label, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(data.createdAt, { align: 'right' });
    doc.moveDown();

    doc.fontSize(12).text(`Overall Match: ${data.overAllMatch}%`);
    doc.text(`Right Upper Arm: ${data['Right-Upper-Arm']}%`);
    doc.text(`Right Lower Arm: ${data['Right-Lower-Arm']}%`);
    doc.text(`Shoulder: ${data['Shoulder']}%`);
    doc.text(`Left Upper Arm: ${data['Left-Upper-Arm']}%`);
    doc.text(`Left Lower Arm: ${data['Left-Lower-Arm']}%`);
    doc.text(`Right Lumbar: ${data['Right-Lumbar']}%`);
    doc.text(`Left Lumbar: ${data['Left-Lumbar']}%`);
    doc.text(`Abdomen: ${data['Abdomen']}%`);
    doc.text(`Right Thigh: ${data['Right-Thigh']}%`);
    doc.text(`Right Cough: ${data['Right-Cough']}%`);
    doc.text(`Left Thigh: ${data['Left-Thigh']}%`);
    doc.text(`Left Cough: ${data['Left-Cough']}%`);
    doc.moveDown();

    doc.fontSize(12).text('Detailed Analysis and Feedback:', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text(analysis);
    doc.moveDown();

    doc.end();
}

function generateReport(item) {
    return generateText({
        label: item.label,
        overAllMatch: item.overAllMatch,
        "Right-Upper-Arm": item.eachLimbMatch[0],
        "Right-Lower-Arm": item.eachLimbMatch[1],
        "Shoulder": item.eachLimbMatch[2],
        "Left-Upper-Arm": item.eachLimbMatch[3],
        "Left-Lower-Arm": item.eachLimbMatch[4],
        "Right-Lumbar": item.eachLimbMatch[5],
        "Left-Lumbar": item.eachLimbMatch[6],
        "Abdomen": item.eachLimbMatch[7],
        "Right-Thigh": item.eachLimbMatch[8],
        "Right-Cough": item.eachLimbMatch[9],
        "Left-Thigh": item.eachLimbMatch[10],
        "Left-Cough": item.eachLimbMatch[11],
        createdAt: item.createdAt
    });
}

export default generateReport;
