import GetResult from "@/components/GetResult";
import { genToken } from "@/lib/getToken";

export default async function ResultPage({ searchParams }) {
  const searchParamsData =await  searchParams;
  const rollNo = searchParamsData?.rollNo;

  // ✅ Generate secure JWT on the server
  const secretKey = process.env.SECRET_KEY;
  const token = genToken(secretKey);

  return (
    <div className="min-h-screen bg-red-700 ">
      {rollNo ? (
        <GetResult rollNo={rollNo} token={token} />
      ) : (
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <h1 className="text-2xl font-semibold text-indigo-700 mb-4">
            Missing Roll Number 😕
          </h1>
          <p className="text-gray-600">
            Please enter a valid roll number in the URL.<br />
            Example: <code>/result?rollNo=2300541539001</code>
          </p>
        </div>
      )}
    </div>
  );
}
