import fs from "fs";
import path from "path";

export const deleteFile = (fileUrl) => {
  try {
    if (!fileUrl) return;

    // Ignore external URLs
    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return;
    }

    const fileName =
      fileUrl.split("/uploads/")[1];

    if (!fileName) return;

    const filePath = path.join(
      process.cwd(),
      "uploads",
      fileName
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        `Deleted file: ${fileName}`
      );
    }
  } catch (error) {
    console.error(
      "File delete error:",
      error.message
    );
  }
};