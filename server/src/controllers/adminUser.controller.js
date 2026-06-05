const prisma = require("../config/prisma");

async function getAdminUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        purchases: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                type: true,
              },
            },
          },
        },
      },
    });

    const formattedUsers = users.map((user) => {
      const successfulPurchases = user.purchases.filter(
        (purchase) =>
          purchase.status === "PAID" ||
          purchase.status === "SUCCESS" ||
          purchase.status === "COMPLETED"
      );

      const totalSpent = successfulPurchases.reduce((sum, purchase) => {
        return sum + Number(purchase.amount || purchase.product?.price || 0);
      }, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        totalPurchases: successfulPurchases.length,
        totalSpent,
        productsBought: successfulPurchases.map((purchase) => ({
          id: purchase.product?.id,
          title: purchase.product?.title,
          price: purchase.product?.price,
          type: purchase.product?.type,
          purchasedAt: purchase.createdAt,
        })),
      };
    });

    res.json({
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminUsers,
};