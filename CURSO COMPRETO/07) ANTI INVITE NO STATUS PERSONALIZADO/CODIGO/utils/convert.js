const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const gifFrames = require('gif-frames');
const { encode } = require('apng');

async function convertGifToApng(gifPath, outputPath) {
    try {
        const frames = await gifFrames({ url: gifPath, frames: 'all', outputType: 'png' });

        const images = await Promise.all(frames.map(async frame => {
            const buffer = frame.getImage()._obj;
            return sharp(buffer).png().toBuffer();
        }));

        const encoded = encode(images.map((img, idx) => ({
            data: img,
            delay: frames[idx].frameInfo.delay * 10 // delay is in hundredths of a second
        })));

        fs.writeFileSync(outputPath, encoded);
        console.log(`Converted ${gifPath} to ${outputPath}`);
    } catch (error) {
        console.error('Error converting GIF to APNG:', error);
    }
}

// Example usage:
convertGifToApng(path.join(__dirname, '../images/emoji.gif'), path.join(__dirname, '../images/emoji.apng'));
