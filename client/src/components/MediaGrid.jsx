export default function MediaGrid({ media }) {
  if (!media || media.length === 0) return null;

  // Helper to render each media item
  const renderMediaItem = (item) => {
    return item.type === "video" ? (
      <video key={item.url} src={item.url} className="object-cover rounded w-full h-full" controls />
    ) : (
      <img key={item.url} src={item.url} className="object-cover rounded w-full h-full" />
    );
  };

  // Single media: full width square
  if (media.length === 1) {
    return <div className="w-full aspect-square">{renderMediaItem(media[0])}</div>;
  }

  // Two media: side by side, same size
  if (media.length === 2) {
    return (
      <div className="flex gap-2 w-full">
        <div className="w-1/2 aspect-square">{renderMediaItem(media[0])}</div>
        <div className="w-1/2 aspect-square">{renderMediaItem(media[1])}</div>
      </div>
    );
  }

  // More than two: left side first, right side grid
  const remaining = media.slice(1);
  const extraCount = remaining.length - 3; // show only 3 items in right grid max

  return (
    <div className="flex gap-2 w-full h-80"> {/* fixed height, adjusts to post width */}
      {/* Left side: first media */}
      <div className="w-1/2 h-full">{renderMediaItem(media[0])}</div>

      {/* Right side: 2x2 grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-1/2 h-full">
        {remaining.slice(0, 3).map((item, index) => (
          <div key={index} className="relative w-full h-full">
            {renderMediaItem(item)}
            {index === 2 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded">
                +{extraCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
