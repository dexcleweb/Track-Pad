const prisma = require("../config/prisma");

async function getAdminStats(req, res, next) {
  try {
    const [users, products, orders, bookings, revenueData] =
      await Promise.all([
        prisma.user.count(),

        prisma.product.count({
          where: {
            isActive: true,
          },
        }),

        prisma.order.count(),

        prisma.counsellingBooking.count(),

        prisma.order.aggregate({
          where: {
            status: "PAID",
          },
          _sum: {
            totalAmount: true,
          },
        }),
      ]);

    const revenue = revenueData._sum.totalAmount || 0;

    res.json({
      stats: {
        users,
        products,
        orders,
        bookings,
        revenue,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

async function deleteAdminOrder(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function clearAdminOrders(req, res, next) {
  try {
    await prisma.order.deleteMany({});

    res.json({
      success: true,
      message: "All orders deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminStats,
  getAdminOrders,
  deleteAdminOrder,
  clearAdminOrders,
  getAdminUsers,
};
