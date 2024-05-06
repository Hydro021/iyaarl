import Work from "@models/Work";
import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    let { query } = params;
    query = decodeURIComponent(query); // decode the query parameter

    let works = [];

    if (query === "all") {
      works = await Work.find().populate("creator");
    } else {
      works = await Work.find({
        $or: [
          { 'category': { $regex: query, $options: "i" } },
          { 'title': { $regex: query, $options: "i" } },
        ]
      }).populate("creator");
    }

    console.log(works)

    if (!works || works.length === 0) return new Response("No works found", { status: 404 });

    return new Response(JSON.stringify(works), { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response("Internal server error", { status: 500 });
  }
}; 
