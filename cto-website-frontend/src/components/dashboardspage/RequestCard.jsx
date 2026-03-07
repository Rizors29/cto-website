function RequestCard({ title, value, colorClass, isLoading }) {
  return (
    <div className={`p-4 rounded-lg text-white ${colorClass}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      {isLoading ? (
        <div className="w-6 h-6 border-4 border-white mt-2 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      )}
    </div>
  );
};

export default RequestCard;