export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const uploadMultipleImages = async (
  req,
  res
) => {
  try {
    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const images = req.files.map(
      (file) => ({
        filename: file.filename,
        originalname:
          file.originalname,
        size: file.size,
        url: `/uploads/${file.filename}`,
      })
    );

    res.status(200).json({
      success: true,
      message:
        "Images uploaded successfully",
      data: images,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};