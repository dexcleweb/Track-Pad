const { z } = require("zod");
const prisma = require("../config/prisma");
const createSlug = require("../utils/slug");

const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().int().positive(),

  type: z.enum([
    "NOTION_TEMPLATE",
    "HABIT_TRACKER",
    "DIGITAL_PRODUCT",
    "COUNSELLING",
    "OTHER",
  ]),

  deliveryType: z.enum(["LINK", "FILE", "BOTH", "BOOKING"]),

  deliveryUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),

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

async function getProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
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

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    const slug = createSlug(data.title);

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        thumbnail,
        currency: "INR",
        deliveryUrl: data.deliveryUrl || null,
        fileUrl: data.fileUrl || null,
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

    const thumbnail = req.file
      ? { thumbnail: `/uploads/${req.file.filename}` }
      : {};

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...data,
        ...thumbnail,
        ...(data.title ? { slug: createSlug(data.title) } : {}),
        ...(data.deliveryUrl !== undefined
          ? { deliveryUrl: data.deliveryUrl || null }
          : {}),
        ...(data.fileUrl !== undefined ? { fileUrl: data.fileUrl || null } : {}),
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