import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'm2nzahdz',
  api_key: '237813323756778',
  api_secret: 'W1dxW4MfLZT4dAajyiMeVhOwcek'
});

async function run() {
  try {
    // 2. Upload an image
    console.log("Uploading image...");
    const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
      public_id: 'onboarding_sample'
    });
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    // 3. Get image details
    console.log("\nImage Details:");
    console.log("Width:", uploadResult.width);
    console.log("Height:", uploadResult.height);
    console.log("Format:", uploadResult.format);
    console.log("Size in bytes:", uploadResult.bytes);

    // 4. Transform the image
    // f_auto: Automatically selects the most efficient image format based on the requesting browser
    // q_auto: Automatically determines the best compression level to minimize file size without degrading visual quality
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log("\nDone! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformedUrl);

  } catch (error) {
    console.error("Error running Cloudinary script:", error);
  }
}

run();
