const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');
const files = fs.readdirSync(assetsDir);

async function processImages() {
    for (const file of files) {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;

        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const isOver100KB = stats.size > 100 * 1024;
        const isNotWebp = !file.toLowerCase().endsWith('.webp');

        if (isOver100KB || isNotWebp) {
            console.log(`Processing ${file} (Size: ${(stats.size / 1024).toFixed(1)} KB)`);
            const baseName = file.replace(/\.[^/.]+$/, "");
            const outPath = path.join(assetsDir, baseName + '.webp');
            
            // Temporary path to avoid overwriting if reading from same file
            const tempOutPath = path.join(assetsDir, 'temp_' + baseName + '.webp');

            try {
                // Determine quality based on original size
                let quality = 70;
                if (stats.size > 500 * 1024) quality = 40;
                
                await sharp(filePath)
                    .webp({ quality: quality, effort: 6 })
                    .toFile(tempOutPath);

                const newStats = fs.statSync(tempOutPath);
                
                // Remove original if it's different or if we successfully replaced it
                if (filePath !== outPath) {
                    fs.unlinkSync(filePath); // e.g. delete .jpg
                } else if (filePath === outPath) {
                    fs.unlinkSync(filePath); // delete original .webp to replace
                }

                fs.renameSync(tempOutPath, outPath);
                console.log(` -> Saved ${baseName}.webp (${(newStats.size / 1024).toFixed(1)} KB)`);

            } catch (err) {
                console.error(`Failed on ${file}: ${err.message}`);
                if (fs.existsSync(tempOutPath)) fs.unlinkSync(tempOutPath);
            }
        }
    }
    console.log("Image processing complete.");
}

processImages();
