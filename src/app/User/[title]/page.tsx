import Navbar from "../navbar";

interface PositionParams {
  params: {
    title: string;
  };
}


export default function Feedback({ params: { title } }: PositionParams) {
  return (
    <div className="bg-slate-50 h-full">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mt-80">Positions</h1>
      </div>
    </div>
  );
}