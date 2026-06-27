const { z } = require("zod");
const prisma = require("../config/prisma");
const createSlug = require("../utils/slug");

const productSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters."),

  price: z.coerce
    .number()
    .int("Price must be a whole number.")
    .min(0, "Price must be 0 or greater."),

  type: z.enum([
    "NOTION_TEMPLATE",
    "HABIT_TRACKER",
    "DIGITAL_PRODUCT",
    "COUNSELLING",
    "OTHER",
  ]),

  deliveryType: z.enum(["LINK", "FILE", "BOTH", "BOOKING"]),

  deliveryUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => value || null),

  fileUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => value || null),

  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return true;
      if (value === true || value === "true") return true;
      if (value === false || value === "false") return false;
      return true;
    }),
});

const updateProductSchema = productSchema.partial();

const getUploadedImageUrl = (req) => {
  const uploadedFile =
    req.files?.thumbnail?.[0] ||
    req.files?.tutorialImage?.[0] ||
    req.file;

  return uploadedFile?.path || null;
};

const buildUniqueSlug = async (title, currentProductId = null) => {
  const baseSlug = createSlug(title);

  const existingProduct = await prisma.product.findUnique({
    where: {
      slug: baseSlug,
    },
  });

  if (!existingProduct) {
    return baseSlug;
  }

  if (currentProductId && existingProduct.id === currentProductId) {
    return baseSlug;
  }

  return `${baseSlug}-${Date.now()}`;
};

async function getProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: req.params.slug,
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const data = productSchema.parse(req.body);

    const thumbnail = getUploadedImageUrl(req);

    const slug = await buildUniqueSlug(data.title);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        price: data.price,
        currency: "INR",
        type: data.type,
        deliveryType: data.deliveryType,
        thumbnail,
        deliveryUrl: data.deliveryUrl,
        fileUrl: data.fileUrl,
        isActive: data.isActive,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const data = updateProductSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const uploadedImageUrl = getUploadedImageUrl(req);

    const thumbnail = uploadedImageUrl
      ? {
          thumbnail: uploadedImageUrl,
        }
      : {};

    const slug = data.title
      ? await buildUniqueSlug(data.title, req.params.id)
      : existingProduct.slug;

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...data,
        ...thumbnail,
        slug,
      },
    });

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        isActive: false,
      },
    });

    res.json({
      message: "Product disabled successfully.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};