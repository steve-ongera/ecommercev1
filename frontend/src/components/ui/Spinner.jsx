const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${colors[color]}`}
      ></div>
    </div>
  );
};

export default Spinner;