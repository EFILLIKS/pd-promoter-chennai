import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image, file } = await req.json();
    const dataToUpload = file || image;

    if (!dataToUpload) {
      return NextResponse.json({ error: 'No upload data provided' }, { status: 400 });
    }

    // Upload to Cloudinary in "PD Construction" folder with auto resource type (supports image, video, raw)
    const uploadResponse = await cloudinary.uploader.upload(dataToUpload, {
      folder: 'PD Construction',
      resource_type: 'auto',
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      fileType: uploadResponse.resource_type,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { publicId, resourceType } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
    }

    const deleteResponse = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image',
    });

    return NextResponse.json({ success: true, result: deleteResponse.result });
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
