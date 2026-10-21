// Shimmering placeholder bar for a number that is being recalculated
// (styles: .rmd-skeleton in index.css)
const Skeleton = ({ className = "" }) => (
  <span aria-hidden className={`rmd-skeleton ${className}`} />
);

export default Skeleton;
