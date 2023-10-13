type ColorDotProps = {
  backgroundColor: string;
};

export const ColorDot: React.FC<ColorDotProps> = ({ backgroundColor }) => {
  return (
    <div
      className="h-6 w-6 rounded-full border"
      style={{ backgroundColor: backgroundColor }}
    />
  );
};
