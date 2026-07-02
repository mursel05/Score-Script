import { prisma } from "@/src/lib/prisma";

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         essays: {
//           include: {
//             evaluation: true,
//           },
//         },
//       },
//       orderBy: {
//         essays: {
//           _count: "desc"
//         },
//       },
//       take: 10,
//     });
//     return new Response(JSON.stringify(users), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
