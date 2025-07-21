export  interface DashboardData {
  totalSales: number;
  orderCount: number;
  userCount: number;
  recentOrders: {
    _id: string;
    totalPrice: number;
    createdAt: string;
    user?: {
      email: string;
    };
  }[];
  popularProducts: {
    _id: string;
    name: string;
    sold: number;
    price: number;
  }[];
  salesTrend: {
    _id: string;
    total: number;
  }[];
  statusCounts: {
    _id: string;
    count: number;
  }[];
}
