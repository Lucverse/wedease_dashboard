interface CardData {
  header: string;
  details: { [key: string]: string | number };
}

interface CardsProps {
  data: CardData;
  theme?: 'neutral' | 'success' | 'failure';
}

const Cards = ({ data, theme = 'neutral' }: CardsProps) => {
  const themeClasses = {
    neutral: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    failure: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-md border transition-transform transform hover:scale-[1.02] hover:shadow-lg ${themeClasses[theme]}`}
    >
      <h2 className="text-2xl font-bold mb-4 tracking-tight">
        {data?.header || 'N/A'}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {Object.entries(data?.details).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <dt className="text-sm font-medium text-gray-600">{key}</dt>
            <dd className="text-base font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Cards;
